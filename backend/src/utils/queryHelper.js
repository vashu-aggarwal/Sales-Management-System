const db = require("./db");


//  search WHERE clause for customer name, phone, product name
exports.buildSearchClause = (query) => {
  let whereClause = "WHERE 1=1";
  let params = [];

  if (query && query.trim().length > 0) {
    whereClause += " AND (customer_name LIKE ? OR phone_number LIKE ? OR product_name LIKE ?)";
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  }

  return { whereClause, params };
};

//  filter WHERE clause with multiple criteria

exports.buildFilterClause = (filters) => {
  let whereClause = "WHERE 1=1";
  let params = [];

  const {
    customerRegion,
    productCategory,
    paymentMethod,
    orderStatus,
    dateFrom,
    dateTo,
    gender,
    ageMin,
    ageMax,
    tags,
  } = filters;
  // helper to normalize values to array
  const normalize = (v) => {
    if (v === undefined || v === null) return [];
    if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
    if (String(v).includes(',')) return String(v).split(',').map(s => s.trim()).filter(Boolean);
    if (String(v).trim() === '') return [];
    return [String(v).trim()];
  }

  const MAX_MULTI = 20;
  const MAX_TAGS = 10;

  const regions = normalize(customerRegion);
  const categories = normalize(productCategory);
  const payments = normalize(paymentMethod);
  const genders = normalize(gender);

  const appendInClause = (colName, values) => {
    if (!values || !values.length) return;
    const safeValues = values.slice(0, MAX_MULTI);
    if (safeValues.length === 1) {
      whereClause += ` AND ${colName} = ?`;
      params.push(safeValues[0]);
    } else {
      const placeholders = safeValues.map(_ => '?').join(',');
      whereClause += ` AND ${colName} IN (${placeholders})`;
      params.push(...safeValues);
    }
  }

  appendInClause('customer_region', regions);
  appendInClause('product_category', categories);
  appendInClause('payment_method', payments);
  appendInClause('gender', genders);

  if (orderStatus) {
    whereClause += " AND order_status = ?";
    params.push(orderStatus);
  }

  // sanitize and swap numeric ranges if needed
  let aMin = (ageMin !== undefined && ageMin !== null && ageMin !== '') ? parseInt(ageMin) : null;
  let aMax = (ageMax !== undefined && ageMax !== null && ageMax !== '') ? parseInt(ageMax) : null;
  if (!Number.isFinite(aMin)) aMin = null;
  if (!Number.isFinite(aMax)) aMax = null;
  if (aMin !== null && aMax !== null && aMin > aMax) {
    const t = aMin; aMin = aMax; aMax = t;
  }
  if (aMin !== null) { whereClause += " AND age >= ?"; params.push(aMin); }
  if (aMax !== null) { whereClause += " AND age <= ?"; params.push(aMax); }

  if (dateFrom) { whereClause += " AND date >= ?"; params.push(dateFrom); }
  if (dateTo) { whereClause += " AND date <= ?"; params.push(dateTo); }

  // tags: support comma separated values and match rows that contain ALL provided tags
  if (tags) {
    const tagList = normalize(tags).slice(0, MAX_TAGS);
    if (tagList.length) {
      tagList.forEach(tag => {
        whereClause += " AND (tags LIKE ? OR tags LIKE ? OR tags LIKE ? OR tags = ? )";
        params.push(`${tag},%`, `%,${tag},%`, `%,${tag}`, `${tag}`);
      });
    }
  }

  return { whereClause, params };
};

// Validate sort parameters
exports.getSortConfig = (sortBy = "date", sortOrder = "desc") => {
  const allowedSort = {
    date: "date",
    final_amount: "final_amount",
    customer_name: "customer_name",
    product_name: "product_name",
    quantity: "quantity",
  };

  const orderBy = allowedSort[sortBy] || "date";
  const order = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

  return { orderBy, order };
};

// Sanitize and validate pagination
exports.getPaginationValues = (page = 1, pageSize = 10) => {
  page = Math.max(1, parseInt(page) || 1);
  pageSize = Math.max(1, Math.min(100, parseInt(pageSize) || 10)); 
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset };
};



// Get total count matching a WHERE clause
exports.getTotalCount = async (whereClause, params) => {
  const countQuery = `SELECT COUNT(*) AS total FROM transactions ${whereClause}`;
  const [countResult] = await db.execute(countQuery, params);
  return countResult[0].total;
};


// Fetch rows matching WHERE clause with ordering and pagination

exports.fetchRows = async (whereClause, params, orderBy, order, pageSize, offset) => {
  const sql = `
    SELECT *
    FROM transactions
    ${whereClause}
    ORDER BY ${orderBy} ${order}
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  const [rows] = await db.execute(sql, params);
  return rows;
};

// Response formats

exports.formatListResponse = (data, total, page, pageSize) => {
  return {
    success: true,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    data,
  };
};


exports.formatItemResponse = (item) => {
  return {
    success: true,
    data: item,
  };
};


exports.formatMessageResponse = (message, statusCode = 200, data = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
  };

  if (data) {
    response.data = data;
  }

  return response;
};


exports.formatErrorResponse = (error, statusCode = 500) => {
  return {
    success: false,
    error: error.message || error,
    statusCode,
  };
};
