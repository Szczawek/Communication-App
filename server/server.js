import express from "express";
import cors from "cors";
import "dotenv/config";
import https from "https";
import mysql from "mysql";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import functions from "firebase-functions";
import multer, { memoryStorage } from "multer";
import crypto from "crypto";
// import { loginWithGoogle } from "./firebaseSetup.js";

const PORT = 443;
const app = express();

const db = mysql.createConnection({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  ssl: {
    ca: process.env.DB_SSL,
  },
});

// WSS ID
const userConnections = new Map();

// Multer config
// Size is in bytes
const multerStorage = multer.memoryStorage();
const uploadImage = multer({
  storage: multerStorage,
  size: 400000,
  fileFilter: filterImage,
});

function filterImage(req, file, cb) {
  try {
    const allowedType = ["image/jpeg", "images/jpg", "image/png"];
    if (allowedType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  } catch (err) {
    console.error(err);
  }
}

db.connect((err) => {
  if (err) return console.error(`Error with db: ${err}`);
  console.log("DB MySQL works well!");
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
  const recivedToken = req.headers.token;
  if (!token || !recivedToken || recivedToken == "null") {
    const random = () => {
      const nums = [];
      let count = 0;
      while (count <= 10) {
        nums.push(Math.floor(Math.random() * 10));
        count++;
      }
      return nums;
    };
    const secureToken = jwt.sign(
      { pass: `ShQ${random()}` },
      process.env.JWT_TOKEN,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("session", secureToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 30,
    });
    return res.json({ token: secureToken });
  }
  const checkToken = jwt.verify(recivedToken, process.env.JWT_TOKEN);
  const correctToken = jwt.verify(token, process.env.JWT_TOKEN);
  if (checkToken["pass"] === correctToken["pass"]) {
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
    const { nick, email, unqiueName, avatar, password, banner } = req.body;

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
      avatar,
      banner,
      nick,
      unqiueName,
      encryptedPassword,
      email,
      new Date(),
    ];

    const addUserDBCommand =
      "INSERT INTO users(avatar,banner,nick,unqiue_name,password,email,date) values(?,?,?,?,?,?,?)";
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
}

app.get("/logged-in-user", async (req, res) => {
  try {
    const userIsLogged = req.cookies["user_id"];
    if (!userIsLogged) return res.status(204).json("User isn't logged-in!");
    const id = decrypt(userIsLogged, process.env.COOKIES_KEY);

    const loadUserData =
      "SELECT id, nick,avatar,banner,date, unqiue_name as unqiueName FROM users where id = ?";
    const userData = new Promise((resolve) => {
      db.query(loadUserData, [id], (err, result) => {
        if (err) throw Error(`There is a problem with user data: ${err}`);
        resolve(result[0]);
      });
    });

    const loadUserFriends =
      "SELECT friendID FROM user_friends where `personID` = ?";
    const userFriends = new Promise((resolve) => {
      db.query(loadUserFriends, [id], (err, result) => {
        if (err) throw Error(`Error with user friends db: ${err}`);
        if (!result[0]) resolve([]);
        const friendsID = result.map((e) => e["friendID"]);
        resolve(friendsID);
      });
    });

    const [data, friendsList] = await Promise.all([userData, userFriends]);
    res.json({ ...data, friends: friendsList });
  } catch (err) {
    console.error(`Error with /logged-in-user route: ${err}`);
    res.sendStatus(403);
  }
});

// Get user friends
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const dbCommand = "SELECT friendID from user_friends where personID =?";
  const friendsID = await new Promise((resolve) => {
    db.query(dbCommand, [id], (err, result) => {
      if (err) throw Error(`Error with fetching users: ${err}`);
      resolve(result);
    });
  });

  const idList = friendsID.map((e) => e["friendID"]);
  if (!idList[0]) return res.sendStatus(404);
  const selectFriends = `SELECT nick, avatar, date, id, unqiue_name as unqiueName FROM users where id IN (${idList})`;
  db.query(selectFriends, (err, result) => {
    if (err) throw Error(`Error with firends data: ${err}`);
    res.json({ value: result, limit: 100 });
  });
});

// DOWNLOAD DATA FROM USER IF EXIST
app.get("/user-search/:nick", (req, res) => {
  const { nick } = req.params;
  const dbCommand =
    "SELECT id, nick,avatar,banner,unqiue_name as unqiueName from users where unqiue_name =?";
  db.query(dbCommand, [nick, nick], (err, result) => {
    if (err) throw Error(`Error with user-search: ${err}`);
    if (!result[0]) return res.sendStatus(204);
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
  const addUser = "INSERT into user_friends values(null,?,?)";
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
    "SELECT COUNT(id) as messagesNumber FROM messages where ownerID =? AND recipientID = ? OR ownerID =? AND recipientID =?";
  const messagesNumber = await new Promise((resolve) => {
    db.query(numberOfMessagesCommand, dbValues, (err, result) => {
      if (err) throw Error(`Error with downloads-messages: ${err}`);
      resolve(result[0]);
    });
  });

  const downloadMessagesCommand = `SELECT * FROM messages where ownerID =? AND recipientID =? OR ownerID =? AND recipientID =? ORDER BY id DESC LIMIT 20 OFFSET ${index}`;
  db.query(downloadMessagesCommand, dbValues, (err, result) => {
    if (err) throw Error(`Error with downloads-messages: ${err}`);
    res.json({
      value: result[0] ? result.reverse() : result,
      limit: messagesNumber["messagesNumber"],
    });
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

  const valuesDB = [ownerID, recipientID, new Date(), message];
  const addMessageDB =
    "INSERT INTO messages(ownerID,recipientID,date,message) values(?,?,?,?)";
  db.query(addMessageDB, valuesDB, (err) => {
    if (err) throw Error(`Error with adding message: ${err}`);
    const user = userConnections.get(String(recipientID));
    if (user) user.send("New Message!");
    res.sendStatus(200);
  });
});

app.put("/edit-profile", async (req, res) => {
  try {
    const { name, password, email, id } = req.body;
    const isEmailExistCmd = "SELECT email FROM users where email = ?";

    if (email) {
      const isEmailExist = await new Promise((resolve) => {
        db.query(isEmailExistCmd, [email], (err, result) => {
          if (err) throw `DB in /Edit-profile# check email: ${err}`;
          if (result[0]) return resolve(true);
          resolve(false);
        });
      });
      if (isEmailExist)
        return res
          .sendStatus(409)
          .json("Account with the email is already exist!");
    }
    let encryptedPassword = password;
    if (password) {
      encryptedPassword = await bcrypt.hash(password, 10);
    }
    const clearEmpty = [
      { value: name, name: "nick" },
      { value: encryptedPassword, name: "password" },
      { value: email, name: "email" },
    ];
    const value = [id];
    const valuesToEdit = clearEmpty
      .map((e) => {
        if (e["value"] != null && e["value"].length > 1) {
          value.unshift(e["value"]);
          return `${e["name"]} =?`;
        }
      })
      .filter((e) => e != null)
      .join(", ");
    const editProfileDataCmd = `UPDATE users set ${valuesToEdit} WHERE id =?`;
    db.query(editProfileDataCmd, value, (err) => {
      if (err) throw `Error with /edit-profile #edit data: ${err}`;
      res.send("ok");
    });
  } catch (err) {
    console.error(err);
  }
});

app.post("/edit-images",uploadImage.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  (req, res) => {
    const {avatar,banner} = req.files
    const editImgCmd = "UPDATE users set"
    res.send("ok");
  }
);

app.post("/remove-invite", (req, res) => {
  const { ownerID, recipientID } = req.body;
  const removeInviteCmd =
    "DELETE FROM friendsWaiting where ownerID =? AND recipientID =?";
  db.query(removeInviteCmd, [ownerID, recipientID], (err) => {
    if (err)
      return console.error(`Error with remove invite from friend: ${err}`);
    res.sendStatus(200);
  });
});

app.post("/send-invite", async (req, res) => {
  const { personID, friendID } = req.body;
  // TO REMOVE
  // TO REMOVE
  // TO REMOVE
  // TO REMOVE
  const checkSendInviteCmd =
    "SELECT * FROM friendsWaiting where `ownerID` =? AND `recipientID` =?";

  const tryOne = await new Promise((resolve) => {
    db.query(checkSendInviteCmd, [personID, friendID], (err, result) => {
      if (err)
        return console.error(`Error with check friends invite status: ${err}`);

      if (result[0]) return resolve(false);
      resolve(true);
    });
  });
  // TO REMOVE
  // TO REMOVE
  // TO REMOVE
  // TO REMOVE
  if (!tryOne) return res.sendStatus(200);
  const sendInviteCmd =
    "INSERT INTO friendsWaiting(ownerID, recipientID) values(?,?)";
  db.query(sendInviteCmd, [personID, friendID], (err) => {
    if (err) return console.error(`Error with invite friend: ${err}`);
    res.sendStatus(200);
  });
});

app.get("/invite-from-friends/:id", (req, res) => {
  const { id } = req.params;
  const laodInviteFromFriendsCmd =
    "SELECT ownerID from friendsWaiting where recipientID =?";
  db.query(laodInviteFromFriendsCmd, [id], (err, result) => {
    if (err)
      return console.error(`Error with loading invite from friends: ${err}`);
    if (!result[0]) return res.sendStatus(404);
    res.json(result);
  });
});

// NOT COMPLITED
// NOT COMPLITED
// NOT COMPLITED
app.post("/end-session", (req, res) => {
  const addSesssonTime = "INSERT INTO active_user";
});

// app.get("/google-login", (req, res) => {
//   console.log(12431323);
//   loginWithGoogle()
//   // console.log(loginWithGoogle)
//   res.json({ login: "sd" });
// });

wss.on("connection", (ws, req) => {
  const id = new URL(req.url, `wss://${req.headers.host}`).searchParams.get(
    "userID"
  );

  console.log("WBSOCKET connected!");

  userConnections.set(id, ws);
  ws.on("close", () => {
    console.log("connection was closed!");
    userConnections.delete(id);
  });
});

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`https://localhost:${PORT}`);
});

export const api = functions
  .runWith({ enforceAppCheck: true, vpcConnector: "db-test-two" })
  .region("europe-central2")
  .https.onRequest((req, res) => {
    server.emit("request", req, res);
  });
