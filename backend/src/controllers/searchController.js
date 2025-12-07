const db = require("../utils/db");
const helper = require("../utils/queryHelper");

// Search transactions by customer name, phone, or product name
exports.search = async (req, res) => {
  try {
    const { q, page = 1, pageSize = 10 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json(helper.formatErrorResponse("Search query 'q' is required", 400));
    }
    const { page: p, pageSize: ps, offset } = helper.getPaginationValues(page, pageSize);
    const { whereClause, params } = helper.buildSearchClause(q);
    const totalRows = await helper.getTotalCount(whereClause, params);
    const rows = await helper.fetchRows(whereClause, params, "date", "DESC", ps, offset);
    const response = helper.formatListResponse(rows, totalRows, p, ps);
    res.json(response);

  } catch (error) {
    console.error("[Search Controller Error]", error);
    res.status(500).json(helper.formatErrorResponse(error));
  }
};
