const mysql = require("mysql2/promise");

let connection;
try {
  connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
  });
} catch (err) {
  console.error("Failed to create MySQL pool:", err);
  connection = {
    execute: async () => {
      throw new Error("Database pool is not available: " + err.message);
    },
    query: async () => {
      throw new Error("Database pool is not available: " + err.message);
    },
    getConnection: async () => {
      throw new Error("Database pool is not available: " + err.message);
    },
  };
}

module.exports = connection;
