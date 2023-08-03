const mysql = require("mysql2/promise");

const connectToDb = async () => {
  const client = await mysql.createConnection({
    host: "localhost",
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  });
  return client;
};

module.exports = connectToDb;
