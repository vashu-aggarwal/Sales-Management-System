const db = require("../utils/db");
const helper = require("../utils/queryHelper");


// Get transactions sorted by specified field
exports.sort = async (req, res) => {
  try {
    const { sortBy = "date", sortOrder = "desc", page = 1, pageSize = 10 } = req.query;

    const { page: p, pageSize: ps, offset } = helper.getPaginationValues(page, pageSize);
    const { orderBy, order } = helper.getSortConfig(sortBy, sortOrder);

    const whereClause = "WHERE 1=1";
    const params = [];

    const totalRows = await helper.getTotalCount(whereClause, params);
    const rows = await helper.fetchRows(whereClause, params, orderBy, order, ps, offset);

    const response = helper.formatListResponse(rows, totalRows, p, ps);
    res.json(response);
  } catch (error) {
    console.error("[Sort Controller Error]", error);
    res.status(500).json(helper.formatErrorResponse(error));
  }
};
