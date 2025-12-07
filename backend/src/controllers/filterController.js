const db = require("../utils/db");
const helper = require("../utils/queryHelper");

// Filter transactions by region, category, payment method, status, date range
exports.filter = async (req, res) => {
  try {
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
      sortBy = "date",
      sortOrder = "desc",
      page = 1,
      pageSize = 10,
    } = req.query;

    const { page: p, pageSize: ps, offset } = helper.getPaginationValues(page, pageSize);

    const { whereClause, params } = helper.buildFilterClause({
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
    });

    // Defensive checks: limit number of tag/filter values
    const normalize = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
      return String(v).split(',').map(s => s.trim()).filter(Boolean);
    }
    const allLists = [
      normalize(customerRegion),
      normalize(productCategory),
      normalize(paymentMethod),
      normalize(gender),
      normalize(tags),
    ];
    const MAX_VALUES = 50;
    const MAX_TAGS = 10;
    // check overall size
    for (const list of allLists) {
      if (list.length > MAX_VALUES) {
        return res.status(400).json(helper.formatErrorResponse(`Too many filter values (limit ${MAX_VALUES})`, 400));
      }
    }
    if (normalize(tags).length > MAX_TAGS) {
      return res.status(400).json(helper.formatErrorResponse(`Too many tags (limit ${MAX_TAGS})`, 400));
    }

    const { orderBy, order } = helper.getSortConfig(sortBy, sortOrder);

    const totalRows = await helper.getTotalCount(whereClause, params);
    const rows = await helper.fetchRows(whereClause, params, orderBy, order, ps, offset);

    const response = helper.formatListResponse(rows, totalRows, p, ps);
    res.json(response);
  } catch (error) {
    console.error("[Filter Controller Error]", error);
    res.status(500).json(helper.formatErrorResponse(error));
  }
};
