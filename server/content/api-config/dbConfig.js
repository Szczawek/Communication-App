import "dotenv/config";
import mysql2 from "mysql2";
import {createClient}from "redis"

const socketDB = createClient()
// await socketDB.connect()

// socketDB.on("error", (err) => {
//   console.log(`Error with redis: ${err}`);
// });

// await socketDB.connect((msg) => {
//   console.log("connected!") 
//   console.log(msg);
// });


const db = mysql2.createConnection({
  database: process.env.DB_DATABASE || "magazine",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "9goFK18O7XNFZI",
  host: process.env.DB_HOST || "127.0.0.1",
  // ssl: {
  //   ca: process.env.DB_SSL ,
  // },
});
  
export {db,socketDB}