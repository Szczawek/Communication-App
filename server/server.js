import express from "express";
import cors from "cors";
import "dotenv/config";
import https from "https";
import mysql from "mysql";
import helmet from "helmet";
const PORT = 443;
const app = express();

// DB congig
const db = mysql.createConnection({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
});

db.connect((err) => {
  if (err) throw err;
  console.log("db works well!");
});

// SERVER config
app.use(cors({ origin: ["https://localhost:5173"] }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "blob:"],
        "script-src": ["'self'"],
      },
    },
  })
);

// HTTPS config
const options = {
  key: process.env.KEY_SSH,
  cert: process.env.CERT_SSH,
};
const server = https.createServer(options, app);

// START POINT
app.get("/", (req, res) => {
  res.json("Szczawik");
});

// DOWLOAD USERS
app.get("/users", (req, res) => {
  const dbCommand = "SELECT * FROM users";
  db.query(dbCommand, (err, result) => {
    if (err) throw Error(`Error with fetching users: ${err}`);
    res.json(result);
  });
});

// LOGIN ACCOUNT
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const dbValue = [email, password];
  const dbCommand = "SELECT * FROM users where email =? AND password =?";
  db.query(dbCommand, dbValue, (err, result) => {
    if (err) throw Error(`Error with login db: ${err}`);
    if (!result[0]) return res.status(401).send("Bad login");
    res.send("Logged to account succesfuly");
  });
});

// CREATE ACCOUNT IN SENDERSON
app.post("/create-account", (req, res) => {
  const { nick, email, unqiueName, avatar, password } = req.body;
  const dbValues = [nick, unqiueName, password, email, new Date()];
  const dbCommand =
    "INSERT INTO users(nick,unqiue_name,password,email,date) values(?,?,?,?,?)";
  db.query(dbCommand, dbValues, (err) => {
    if (err) throw Error(`Error with account-creator: ${err}`);
    res.send("The account has been created successfully!");
  });
});

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`https://localhost:${PORT}`);
});
