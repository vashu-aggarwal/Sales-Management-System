const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const searchController = require("../controllers/searchController");
const filterController = require("../controllers/filterController");
const sortController = require("../controllers/sortController");


// GET /api/transaction/search?q=query
router.get("/search", searchController.search);

// GET /api/transaction/filter
router.get("/filter", filterController.filter);

// GET /api/transaction/sorted
router.get("/sorted", sortController.sort);

// GET /api/transaction
router.get("/", transactionController.listAll);

// GET /api/transaction/:id
router.get("/:id", transactionController.getById);





module.exports = router;
