import "dotenv/config";
import {createConnection} from "mysql2";
import {createClient}from "redis"

// const socketDB = createClient()

const db = createConnection({
  database: process.env.DB_DATABASE || "magazine",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "9goFK18O7XNFZI",
  host: process.env.DB_HOST || "127.0.0.1",
  port:process.env.DB_PORT || 3306,
  // ssl: {
  //   ca: process.env.DB_SSL ,
  // },
});
  
const socketDB = 1

export {db,socketDB}