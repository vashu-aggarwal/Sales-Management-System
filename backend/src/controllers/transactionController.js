const db = require("../utils/db");
const helper = require("../utils/queryHelper");


//List all transactions with pagination
exports.listAll = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const { page: p, pageSize: ps, offset } = helper.getPaginationValues(page, pageSize);

    const whereClause = "WHERE 1=1";
    const params = [];

    const totalRows = await helper.getTotalCount(whereClause, params);
    const rows = await helper.fetchRows(whereClause, params, "date", "DESC", ps, offset);

    const response = helper.formatListResponse(rows, totalRows, p, ps);
    res.json(response);
  } catch (error) {
    console.error("[Transaction Controller - List Error]", error);
    res.status(500).json(helper.formatErrorResponse(error));
  }
};


// Get a single transaction by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json(helper.formatErrorResponse("Valid transaction ID is required", 400));
    }

    const sql = "SELECT * FROM transactions WHERE id = ? LIMIT 1";
    const [rows] = await db.execute(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json(helper.formatErrorResponse("Transaction not found", 404));
    }

    res.json(helper.formatItemResponse(rows[0]));
  } catch (error) {
    console.error("[Transaction Controller - Get By ID Error]", error);
    res.status(500).json(helper.formatErrorResponse(error));
  }
};

