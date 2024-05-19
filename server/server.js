import express from "express";
import cors from "cors";
import "dotenv/config";
import https from "https";
import mysql from "mysql";
import helmet from "helmet";
import cookieParser from "cookie-parser";

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
app.use(cors({ origin: ["https://localhost:5173"], credentials: true }));
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

app.use(cookieParser());

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

// Get a specific group of users
app.get("/users:id", (req, res) => {
  const { id } = req.params;
  const dbCommand = "SELECT nick,date,avatar FROM users ";
  db.query(dbCommand, (err, result) => {
    if (err) throw Error(`Error with fetching users: ${err}`);
    res.json(result);
  });
});

// DOWNLOAD DATA FROM USER IF EXIST
app.get("/user-search:nick", (req, res) => {
  const { nick } = req.params;
  const dbCommand =
    "SELECT id, nick,avatar,unqiue_name as unqiueName from users where nick =? or unqiue_name =?";
  db.query(dbCommand, [nick, nick], (err, result) => {
    if (err) throw Error(`Error with user-search: ${err}`);
    if (!result[0]) return res.sendStatus(404);
    res.json(result[0]);
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
    setLoggedInUser(res, result[0]["id"]);
    res.send("Logged to account succesfuly");
  });
});

function setLoggedInUser(res, id) {
  res.cookie(
    "logged-in",
    { id: id },
    {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
    }
  );
}

app.get("/logged-in-user", async (req, res) => {
  try {
    const idInCookie = req.cookies["logged-in"];
    if (!idInCookie) return res.status(404).json("User isn't logged-in!");

    const { id } = idInCookie;
    console.log(id);
    const dbDownloadUserData =
      "SELECT id, nick,avatar,date, unqiue_name as unqiueName FROM users where id = ?";
    const userData = await new Promise((resolve) => {
      db.query(dbDownloadUserData, [id], (err, result) => {
        if (err) throw Error(`Error with logged-in-user: ${err}`);
        resolve(result[0]);
      });
    });
    console.log(userData);
    const dbDownloadUserFriends =
      "SELECT id FROM user_friends where `personID` = ?";
    const userFriends = await new Promise((resolve) => {
      db.query(dbDownloadUserFriends, [id], (err, result) => {
        if (err) throw Error(`Error with user friends db: ${err}`);
        resolve(result);
      });
    });
    const data = await {
      ...userData,
      friends: userFriends.map((e) => e["id"]),
    };
    res.json(data);
  } catch (err) {
    throw err;
  }
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

// Add/Remove friend with user firends list
app.post("/friends-list-change", (req, res) => {
  const { action, personID, friendID } = req.body;

  const addUser = "INSERT INTO user_friends(personID, friendID) values(?,?)";
  const removeUser =
    "DELETE FROM user_friends where personID =? AND friendID =?";

  const dbValues = [personID, friendID];
  let dbActionType;
  switch (action) {
    case "add":
      dbActionType = addUser;
      break;
    case "remove":
      dbActionType = removeUser;
      break;
    default:
      res.sendStatus(400);
      throw Error("Bad action type!");
  }
  db.query(dbActionType, dbValues, (err) => {
    if (err) throw Error(`Error to add/remove firend: ${err}`);
    res.json("The action was performed successfully!");
  });
});

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`https://localhost:${PORT}`);
});
