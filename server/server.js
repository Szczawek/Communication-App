import express from "express";
import "dotenv/config";
import https from "https";
import bcrypt from "bcrypt";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import functions from "firebase-functions";
import multer from "multer";
import { auth, bucket } from "./firebaseSetup.js";
import { getDownloadURL } from "firebase-admin/storage";
import { sendEmail } from "./content/sendEmail.js";
import {
  corsOptions,
  helemtOptions,
  limitOptions,
} from "./content/api-config/config.js";
import { confirmCodeHTML } from "./content/confirmCodeHTML.js";
import { db } from "./content/api-config/dbConfig.js";
import {
  confirmEmailCode,
  encrypt,
  decrypt,
} from "./content/api-config/hashFunctions.js";

const PORT = 443;
const app = express();

// WSS ID
const userConnections = new Map();

// Multer config
// Size is in bytes
// # Max size of one image is 400KB but in edit-profile is possible to load two images
const multerStorage = multer.memoryStorage();
const uploadImage = multer({
  storage: multerStorage,
  size: 1000000,
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
    console.error(`Error with the file: ${err}`);
  }
}

// SERVER config
app.set("trust proxy", 1);
app.use(limitOptions);
app.use(express.json());
app.use(cookieParser());
app.use(corsOptions);
app.use(helemtOptions);

// HTTPS SSL
const options = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT,
};

const server = https.createServer(options, app);

const wss = new WebSocketServer({
  server,
});

db.connect((err) => {
  if (err) {
    console.error(`Error with db: ${err}`);
    server.close();
    return;
  }
  console.log("DB MySQL works well!");
});

// SIMPLE/WISE
// # Only for local testing/protection against overflow requests
let count = 0;
// First wall
const authorization = (req, res, next) => {
  try {
    if (count >= 500) {
      server.close(() => {
        console.log("Limit!");
        return res.status(403).json("Server has reached his limit!");
      });
    }
    count++;
    const token = req.cookies["session"];
    const recivedToken = req.headers.token;
    if (!token || !recivedToken || recivedToken == "null") {
      const secureToken = jwt.sign(
        { pass: `ShQ${Date.now()}` },
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

    if (checkToken["pass"] === correctToken["pass"]) return next();
    res.status(403).json("Token is incorrect!");
  } catch (err) {
    console.error("invalid jwt key", err);
    res.sendStatus(403).json("jwt token is incorrect");
  }
};

app.use(authorization);
app.use("/api", onlyLoggedInUsers);
function onlyLoggedInUsers(req, res, next) {
  try {
    const isUserLogged = req.cookies["user_id"];
    if (!isUserLogged) return res.status(403).json("unlogged user!");
    const id = decrypt(isUserLogged, process.env.COOKIES_KEY);
    if (!id) res.status(403).json("Empty cookies!");
    next();
  } catch (err) {
    console.error("An unauthorized person tries to set cookies \n", err);
    res
      .status(403)
      .json("An unauthorized person tries to set cookies, that is the result");
  }
}

app.get("/", async (req, res) => {
  try {
    const { ip } = req;
    const find = "SELECT * FROM collector where ip =?";
    await new Promise((res, rej) => {
      db.query(find, [ip], (err, result) => {
        if (err || result[0]) return rej();
        res();
      });
    });
    const command = "INSERT INTO collector(id,ip) VALUES(NULL,?)";
    db.query(command, [req.ip], (err) => {
      if (err) console.log("err");
      console.log(req.ip);
    });
  } catch (err) {
    console.log(err);
  } finally {
    res.send("What are you looking at?");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const getUserPassword = "SELECT password FROM users where email =?";
    const correctUserPassword = await new Promise((resolve, reject) => {
      db.query(getUserPassword, [email], (err, result) => {
        if (err) throw `Error with db: /login: ${err}`;
        if (!result[0]) return reject("Wrong Login!");
        resolve(result[0]["password"]);
      });
    });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctUserPassword
    );
    if (!isPasswordCorrect) throw "Wrong Login!";

    //Description, everyone has unqiue email, and unqiue_name. This is the easiest way to find user.
    const loadUserData = "SELECT * FROM users where email = ?";
    db.query(loadUserData, [email], (err, result) => {
      if (err) throw `Error with login db: ${err}`;
      createSession(res, result[0]["id"]);
      res.send("Logged to account succesfuly");
    });
  } catch (err) {
    // to edit
    const amount = req.cookies["log_amount"];
    const value = !amount ? 0 : JSON.parse(amount) + 1;
    res.cookie("log_amount", JSON.stringify(value), {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned: true,
      maxAge: 1000 * 60 * 60,
    });
    res.status(403).json(err);
  }
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
      "/images/user.jpg",
      "/images/banner.jpg",
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

function randomCode() {
  let code = "";
  let count = 0;
  while (count < 6) {
    code += Math.floor(Math.random() * 9);
    count++;
  }
  return Number(code);
}

app.post("/send-email-code", (req, res) => {
  const { user, subject } = req.body;
  const data = {
    user,
    subject,
    html: confirmCodeHTML(confirmEmailCode()),
  };
  sendEmail(res, data);
});
app.post("/check-email-code", (req, res) => {
  const { code } = req.body;
  res.clearCookie("em_code", {
    secure: true,
    partitioned: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  res.json("ok");
});

app.get("/logged-in-user", async (req, res) => {
  try {
    const userIsLogged = req.cookies["user_id"];
    if (!userIsLogged) return res.status(204).json("User isn't logged-in!");
    const id = decrypt(userIsLogged, process.env.COOKIES_KEY);
    // Dodać sprawdzenie czy id zostało storzone przez server, czy przez "intruza", każde cookies ma szyfrowanie
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
    res.status(403).json(`Error in with check if user is logged! ${err}`);
  }
});

// Get user friends
app.get("/api/users/:id", async (req, res) => {
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
app.get("/api/user-search/:nick", (req, res) => {
  const { nick } = req.params;

  // DESC
  // There is a simple question it is worthy to do next request after falled attempt to find user by unqiue name and find after nick or mix it. 
  // The best thing is to do an algoritm to proretize a most knowed persons and, fousce on unqiue name in the first.
  // END OF DESC
  
  const dbCommand =
    "SELECT id, nick,avatar,banner,unqiue_name as unqiueName from users where unqiue_name =? || nick =?";
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
app.post("/api/friends-list-change", (req, res) => {
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

app.post("/api/logout", async (req, res) => {
  await removeLoggedInUser(res);
  res.json("Logout");
});

// load messages
app.get(
  "/api/download-messages/:ownerID/:recipientID/:index",
  async (req, res) => {
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
  }
);

app.get("/api/last-message/:ownerID/:recipientID", (req, res) => {
  const { ownerID, recipientID } = req.params;
  const downloadLastMessage =
    "SELECT * FROM messages WHERE ownerID =? AND recipientID =? ORDER BY id DESC LIMIT 1";
  db.query(downloadLastMessage, [recipientID, ownerID], (err, result) => {
    if (err) throw Error(`Error with last message db: ${err}`);
    res.json(result);
  });
});

// Send Message
app.post("/api/send-message", async (req, res) => {
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

app.put("/api/edit-profile", async (req, res) => {
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

const acceptableFile = uploadImage.fields([
  { name: "avatar", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

app.post("/api/edit-images", acceptableFile, async (req, res) => {
  try {
    const { avatar, banner } = req.files;
    const { ownerID } = req.body;
    const values = [];
    const tableNames = [];

    const array = [avatar, banner]
      .filter((e) => e != undefined)
      .map((e) => {
        // "images/" in fileName means folder name
        const fileName = `images/${Date.now()}-${Math.floor(
          Math.random() * 1e9
        )}.jpg`;
        return new Promise(async (resolve) => {
          const uploadFile = bucket.file(fileName);
          await uploadFile.save(e[0].buffer, { contentType: "image/jpg" });
          const imagePath = await getDownloadURL(uploadFile);
          values.push(imagePath);
          tableNames.push(`${e[0].fieldname} =?`);
          resolve();
        });
      });
    await Promise.all(array);

    const editImgCmd = `UPDATE users set ${tableNames.join(", ")} where id =?`;
    db.query(editImgCmd, [...values, ownerID], (err) => {
      if (err) throw `Error with db edit-images: ${err}`;
      res.send("ok");
    });
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/uploded-images", (req, res) => {
  const { ownerID } = req.body;
  const getUploadedImgCmd = "SELECT avatar, banner from users where id =?";
  db.query(getUploadedImgCmd, [ownerID], (err, result) => {
    if (err) throw `Error with db upload-images: ${err}`;
    res.json(result);
  });
});

app.post("/api/remove-invite", (req, res) => {
  const { ownerID, recipientID } = req.body;
  const removeInviteCmd =
    "DELETE FROM friendsWaiting where ownerID =? AND recipientID =?";
  db.query(removeInviteCmd, [ownerID, recipientID], (err) => {
    if (err)
      return console.error(`Error with remove invite from friend: ${err}`);
    res.sendStatus(200);
  });
});

app.post("/api/send-invite", async (req, res) => {
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

app.get("/api/invite-from-friends/:id", (req, res) => {
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
app.post("/api/end-session", (req, res) => {
  const addSesssonTime = "INSERT INTO active_user";
});

app.get("/api/google-login", (req, res) => {
  // const data = JSON.stringify(auth);
  console.log(1);
  res.json(auth);
});

// wss.on("connection", (ws, req) => {
//   const id = new URL(req.url, `wss://${req.headers.host}`).searchParams.get(
//     "userID"
//   );

//   console.log("WBSOCKET connected!");

//   userConnections.set(id, ws);
//   ws.on("close", () => {
//     console.log("connection was closed!");
//     userConnections.delete(id);
//   });
// });

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`https://127.0.0.1:${PORT}`);
});

// export const api = functions
//   .runWith({ enforceAppCheck: true, vpcConnector: process.env.VPC_CONNECTOR })
//   .region("europe-central2")
//   .https.onRequest((req, res) => {
//     server.emit("request", req, res);
//   });
