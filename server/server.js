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

const PORT = 443;
const app = express();

const limit = rateLimit({
  windowMs: 1000 * 60 * 15,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

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
app.use(
  cors({
    origin: [
      "https://localhost:5173",
      "https://communication-app-d664f.web.app",
    ],
    credentials: true,
  })
);

app.use(limit);
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

const wss = new WebSocketServer({
  server,
});
// START POINT
app.get("/", (req, res) => {
  res.json("Szczawik");
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

// LOGIN ACCOUNT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const getUserPassword = "SELECT password FROM users where email =?";
  const correctUserPassword = await new Promise((resolve) => {
    db.query(getUserPassword, [email], (err, result) => {
      if (err) throw Error(`Server can't find password in db: ${err}`);
      resolve(result[0]["password"]);
    });
  });

  const isPasswordCorrect = await bcrypt.compare(password, correctUserPassword);
  if (!isPasswordCorrect) return res.status(401).send("Bad login!");

  const dbCommand = "SELECT * FROM users where email = ?";
  db.query(dbCommand, [email], (err, result) => {
    if (err) throw Error(`Error with login db: ${err}`);
    setLoggedInUser(res, result[0]["id"]);
    res.send("Logged to account succesfuly");
  });
});

function setLoggedInUser(res, id) {
  res.cookie("logged-in", id, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
}

function removeLoggedInUser(res) {
  res.clearCookie("logged-in", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
}

app.get("/logged-in-user", async (req, res) => {
  try {
    const id = req.cookies["logged-in"];
    if (!id) return res.status(204).json("User isn't logged-in!");
    const dbDownloadUserData =
      "SELECT id, nick,avatar,date, unqiue_name as unqiueName FROM users where id = ?";
    const userData = await new Promise((resolve) => {
      db.query(dbDownloadUserData, [id], (err, result) => {
        if (err) throw Error(`Error with logged-in-user: ${err}`);
        resolve(result[0]);
      });
    });
    const dbDownloadUserFriends =
      "SELECT friendID FROM user_friends where `personID` = ?";
    const userFriends = await new Promise((resolve) => {
      db.query(dbDownloadUserFriends, [id], (err, result) => {
        if (err) throw Error(`Error with user friends db: ${err}`);
        resolve(result);
      });
    });

    const data = await {
      ...userData,
      friends: userFriends.map((e) => e["friendID"]),
    };
    res.json(data);
  } catch (err) {
    throw err;
  }
});

// CREATE ACCOUNT IN SENDERSON
app.post("/create-account", async (req, res) => {
  try {
    const { nick, email, unqiueName, avatar, password } = req.body;

    const passwordHashed = await bcrypt.hash(password, 10);

    const dbValues = [
      avatar ? avatar : "./images/user.jpg",
      nick,
      unqiueName,
      passwordHashed,
      email,
      new Date(),
    ];

    const dbCommand =
      "INSERT INTO users(avatar,nick,unqiue_name,password,email,date) values(?,?,?,?,?,?)";
    await new Promise((resolve) => {
      db.query(dbCommand, dbValues, (err) => {
        if (err) throw Error(`Error with account-creator: ${err}`);
        resolve();
      });
    });

    const searchForUserID = "SELECT id from users where unqiue_name =? ";
    db.query(searchForUserID, [unqiueName], (err, result) => {
      if (err) throw Error(`Error with user id: ${err}`);
      setLoggedInUser(res, result[0]["id"]);
      res.send("The account has been created successfully!");
    });
  } catch (err) {
    throw Error(`Error with create-account: ${err}`);
  }
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

app.post("/logout", (req, res) => {
  removeLoggedInUser(res);
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

const messages = {};
// Send Message
app.post("/send-message", (req, res) => {
  const { ownerID, recipientID, message } = req.body;
  if (messages[recipientID]) {
    messages[recipientID].send("update");
  }
  const valuesDB = [ownerID, recipientID, new Date(), message];
  const addMessageDB =
    "INSERT INTO messages(ownerID,recipientID,date,message) values(?,?,?,?)";
  db.query(addMessageDB, valuesDB, (err) => {
    if (err) throw Error(`Error with adding message: ${err}`);
    res.sendStatus(200);
  });
});

db.end((err) => {
  if (err) {
    console.error("Error ending the connection:", err.stack);
    return;
  }
  console.log("Connection ended gracefully.");
});

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`https://localhost:${PORT}`);
});

wss.on("connection", (ws, req) => {
  const id = new URL(req.url, `https://${req.headers.host}`).searchParams.get(
    "user"
  );
  const addSocketToDB = "INSERT INTO sockets(id,secket) values(?,?)";
  const valueToInsert = [id, ws];
  messages[id] = ws;
  // db.query(addSocketToDB, valueToInsert, (err) => {
  //   if (err) throw Error(`Error durning adding values to sockets: ${err}`);
  //   console.log("add");
  // });

  ws.on("close", () => {
    const removeFromDB = "DELETE from sockets where id =?";
    delete messages[id];
    // db.query(removeFromDB, [id], (err) => {
    //   if (err) throw Error(`Error with removing Sockets with db: ${err}`);
    //   console.log("remove");
    // });
  });
});

export const api = functions.region("europe-central2").https.onRequest((req, res) => {
  server.emit("request", req, res);
});
