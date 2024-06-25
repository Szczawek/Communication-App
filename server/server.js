import express from "express";
import cors from "cors";
import "dotenv/config";
import https from "https";
import mysql from "mysql";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { WebSocketServer } from "ws";
import cookieParser from "cookie-parser";
import functions from "firebase-functions";
import crypto from "crypto";
import sqlite3 from "sqlite3";

const PORT = 443;
const app = express();

const db = mysql.createConnection({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
});

db.connect((err) => {
  if (err) return console.error(`Error with db: ${err}`);
  console.log("DB MySQL works well!");
});

sqlite3.verbose();
const dbLite = new sqlite3.Database(":memory:", (err) => {
  if (err) return console.error("DB Lite is doesn't work propertly!");
  console.log("DB Lite is connected!");
});

dbLite.serialize(() => {
  dbLite.run("CREATE TABLE users (id int,socket TEXT)");
});

// SERVER config
app.set("trust proxy", 1);

const limit = rateLimit({
  windowMs: 1000 * 60 * 60,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limit);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://localhost:5173",
      "https://communication-app-d664f.web.app",
    ],
    credentials: true,
  })
);
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

const wss = new WebSocketServer({
  server,
});

// For cookies/other importat things
function encrypt(text, encryptionKey) {
  const iv = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey, "base64"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();
  const hasedData =
    iv.toString("hex") + ":" + encrypted + ":" + tag.toString("hex");
  return hasedData;
}

function decrypt(encryptedText, encryptionKey) {
  try {
    const parts = encryptedText.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const tag = Buffer.from(parts[2], "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(encryptionKey, "base64"),
      iv
    );
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    throw Error(`Wrong password: ${err}`);
  }
}

// SIMPLE/WISE
let count = 0;
const authorization = (req, res, next) => {
  if (count >= 1000) return res.sendStatus(403);
  count++;
  const token = req.cookies["session"];
  if (!token) {
    const newToken = "1233";
    res.cookie("session", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 7,
    });
    return res.json({ token: newToken });
  }
  const recivedToken = req.headers.token;
  if (token === recivedToken) {
    next();
  } else {
    res.sendStatus(403);
  }
};

app.use(authorization);

app.get("/", (req, res) => {
  res.send("What are you looking at?");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const getUserPassword = "SELECT password FROM users where email =?";

  const correctUserPassword = await new Promise((resolve) => {
    db.query(getUserPassword, [email], (err, result) => {
      if (err) throw Error(`Server can't find password in db: ${err}`);
      if (!result[0]) return res.status(401).send("Wrong Login");
      resolve(result[0]["password"]);
    });
  });

  const isPasswordCorrect = await bcrypt.compare(password, correctUserPassword);
  if (!isPasswordCorrect) return res.status(401).send("Bad login!");

  //Description, everyone has unqiue email, and unqiue_name. This is the easiest way to find user.
  const loadUserData = "SELECT * FROM users where email = ?";
  db.query(loadUserData, [email], (err, result) => {
    if (err) throw Error(`Error with login db: ${err}`);
    createSession(res, result[0]["id"]);

    res.send("Logged to account succesfuly");
  });
});

app.post("/create-account", async (req, res) => {
  try {
    const { nick, email, unqiueName, avatar, password } = req.body;

    const selectUser = "SELECT id FROM users where email =? OR unqiue_name =?";
    const isUserAlreadyExist = await new Promise((resolve) => {
      db.query(selectUser, [email, unqiueName], (err, result) => {
        if (err)
          throw Error(
            `Error, check if user already exist is imposible for that moment! :${err}`
          );
        resolve(result);
      });
    });
    if (isUserAlreadyExist[0]) return res.sendStatus(400);
    const encryptedPassword = await bcrypt.hash(password, 10);
    const values = [
      avatar ? avatar : "./images/user.jpg",
      nick,
      unqiueName,
      encryptedPassword,
      email,
      new Date(),
    ];

    const addUserDBCommand =
      "INSERT INTO users(avatar,nick,unqiue_name,password,email,date) values(?,?,?,?,?,?)";
    await new Promise((resolve) => {
      db.query(addUserDBCommand, values, (err) => {
        if (err)
          throw Error(`Database can't create new user accout now: ${err}`);
        resolve();
      });
    });

    const searchForUserID = "SELECT id from users where unqiue_name =? ";
    db.query(searchForUserID, [unqiueName], (err, result) => {
      if (err) throw Error(`Database can't find user id: ${err}`);
      createSession(res, result[0]["id"]);
      res.send("The account has been created successfully!");
    });
  } catch (err) {
    console.error(`Error with create-account: ${err}`);
    res.sendStatus(403);
  }
});

function createSession(res, id) {
  res.cookie("user_id", encrypt(String(id), process.env.COOKIES_KEY), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  console.log(1231313);
}

app.get("/logged-in-user", async (req, res) => {
  try {
    const userIsLogged = req.cookies["user_id"];
    console.log(userIsLogged);
    if (!userIsLogged) return res.status(204).json("User isn't logged-in!");
    const id = decrypt(userIsLogged, process.env.COOKIES_KEY);
    console.log(id);
    const loadUserData =
      "SELECT id, nick,avatar,date, unqiue_name as unqiueName FROM users where id = ?";
    const userData = await new Promise((resolve) => {
      db.query(loadUserData, [id], (err, result) => {
        if (err) throw Error(`There is a problem with user data: ${err}`);
        resolve(result[0]);
      });
    });

    const loadUserFriends =
      "SELECT friendID FROM user_friends where `personID` = ?";
    const userFriends = await new Promise((resolve) => {
      db.query(loadUserFriends, [id], (err, result) => {
        if (err) throw Error(`Error with user friends db: ${err}`);
        if (!result[0]) resolve([]);
        const friendsID = result.map((e) => e["friendID"]);
        resolve(friendsID);
      });
    });

    const data = await {
      ...userData,
      userFriends,
    };
    res.json(data);
  } catch (err) {
    console.error(`Error with /logged-in-user route: ${err}`);
    res.sendStatus(403);
  }
});

// Get a specific group of users
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const dbCommand = " select friendID from user_friends where personID =?";
  const friendsID = await new Promise((resolve) => {
    db.query(dbCommand, [id], (err, result) => {
      if (err) throw Error(`Error with fetching users: ${err}`);
      resolve(result);
    });
  });
  const idList = friendsID.map((e) => e["friendID"]);
  if (!idList[0]) return res.sendStatus(204);
  const selectFriends = `SELECT * FROM users where id IN (${idList})`;
  db.query(selectFriends, (err, result) => {
    if (err) throw Error(`Error with firends data: ${err}`);
    res.json(result);
  });
});

// DOWNLOAD DATA FROM USER IF EXIST
app.get("/user-search/:nick", (req, res) => {
  const { nick } = req.params;
  const dbCommand =
    "SELECT id, nick,avatar,unqiue_name as unqiueName from users where nick =? or unqiue_name =?";
  db.query(dbCommand, [nick, nick], (err, result) => {
    if (err) throw Error(`Error with user-search: ${err}`);
    if (!result[0]) return res.sendStatus(404);
    res.json(result[0]);
  });
});

async function removeLoggedInUser(res) {
  new Promise((resolve) => {
    res.clearCookie("user_id", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    resolve();
  });
}

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

app.post("/logout", async (req, res) => {
  await removeLoggedInUser(res);
  res.json("Logout");
});

// load messages
app.get("/download-messages/:ownerID/:recipientID/:index", async (req, res) => {
  const { ownerID, recipientID, index } = req.params;

  const dbValues = [ownerID, recipientID, recipientID, ownerID];
  const numberOfMessagesCommand =
    "SELECT COUNT(id) as messagesNumber FROM messages where ownerID =22 AND recipientID = 22 OR ownerID =22 AND recipientID =22";
  const messagesNumber = await new Promise((resolve) => {
    db.query(numberOfMessagesCommand, dbValues, (err, result) => {
      if (err) throw Error(`Error with downloads-messages: ${err}`);
      resolve(result[0]);
    });
  });

  const downloadMessagesCommand = `SELECT * FROM messages where ownerID =? AND recipientID =? OR ownerID =? AND recipientID =? ORDER BY id DESC LIMIT 20 OFFSET ${index}`;
  db.query(downloadMessagesCommand, dbValues, (err, result) => {
    if (err) throw Error(`Error with downloads-messages: ${err}`);
    res.json({ messages: result, limit: messagesNumber["messagesNumber"] });
  });
});

app.get("/last-message/:ownerID/:recipientID", (req, res) => {
  const { ownerID, recipientID } = req.params;
  const downloadLastMessage =
    "SELECT * FROM messages WHERE ownerID =? AND recipientID =? ORDER BY id DESC LIMIT 1";
  db.query(downloadLastMessage, [recipientID, ownerID], (err, result) => {
    if (err) throw Error(`Error with last message db: ${err}`);
    res.json(result);
  });
});

// Send Message
app.post("/send-message", async (req, res) => {
  const { ownerID, recipientID, message } = req.body;
  const selectSocketFromDB = "SELECT socket from users where id =?";
  
  // Sqlite Nie jest w stanie przechowywać tak złożonych obiektów jak WS socket obkiekt
  // Sqlite Nie jest w stanie przechowywać tak złożonych obiektów jak WS socket obkiekt
  // Sqlite Nie jest w stanie przechowywać tak złożonych obiektów jak WS socket obkiekt
  // Sqlite Nie jest w stanie przechowywać tak złożonych obiektów jak WS socket obkiekt
  // Sqlite Nie jest w stanie przechowywać tak złożonych obiektów jak WS socket obkiekt
  // Sqlite Nie jest w stanie przechowywać tak złożonych obiektów jak WS socket obkiekt
  dbLite.get(selectSocketFromDB, [ownerID], (err, result) => {
    if (err) return console.error(err);
    console.log(JSON.parse(result["socket"]))
    if(!result["socket"]) return
    JSON.parse(result["socket"]).send("New Message!");
  });

  const valuesDB = [ownerID, recipientID, new Date(), message];
  const addMessageDB =
    "INSERT INTO messages(ownerID,recipientID,date,message) values(?,?,?,?)";
  db.query(addMessageDB, valuesDB, (err) => {
    if (err) throw Error(`Error with adding message: ${err}`);
    res.sendStatus(200);
  });
});

wss.on("connection", (ws, req) => {
  const id = new URL(req.url, `https://${req.headers.host}`).searchParams.get(
    "user"
  );
  console.log("WBSOCKET connected!");

  const check = dbLite.get(
    "SELECT id FROM users where id =?",
    [id],
    (err, result) => {
      if (err) return console.error(err);
      return result;
    }
  );

  const addSocket = "INSERT INTO users(id,socket) values(?,?)";
  if (!check["id"]) {
    dbLite.run(addSocket, [id, JSON.stringify(ws)]);
  }


  ws.on("close", () => {
    console.log("connection was closed!");
    const removeFromDB = "DELETE from users where id =?";
    dbLite.run(removeFromDB, [id]);
  });
});

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`https://localhost:${PORT}`);
});

export const api = functions
  .region("europe-central2")
  .https.onRequest((req, res) => {
    server.emit("request", req, res);
  });
