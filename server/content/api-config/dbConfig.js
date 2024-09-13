import "dotenv/config";
import mysql2 from "mysql2";

const db = mysql2.createConnection({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  ssl: {
    ca: process.env.DB_SSL,
  },
});
  
export {db}