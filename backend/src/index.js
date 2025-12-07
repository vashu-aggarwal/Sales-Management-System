require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is running...",
    timestamp: new Date().toISOString(),
  });
});

const transactionsRoutes = require("./routes/transactions");


app.use("/api/transaction", transactionsRoutes);

 // Global error handling

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});


app.use((err, req, res, next) => {
  console.error("[Global Error Handler]", err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server Running at Port: ${PORT} `);
});
