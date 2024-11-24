import { db } from "../../api-config/dbConfig.js";
import { createSession } from "./createSession.js";
import bcrypt from "bcrypt";

async function createAccount(req, res) {
  try {
    const cookies = req.cookies["ac-data"];
    if (!cookies) throw "The cookies was deleted!";

    const { nick, email, unqiueName, password } = req.cookies["ac-data"];
    const encryptedPassword = await bcrypt.hash(password, 10);

    const addAccountCmd =
      "INSERT INTO users(avatar,banner,nick,unqiue_name,password,email,date) values(?,?,?,?,?,?,?)";
    const values = [
      "/images/user.jpg",
      "/images/banner.jpg",
      nick,
      unqiueName,
      encryptedPassword,
      email,
      new Date(),
    ];

    await new Promise((resolve, reject) => {
      db.query(addAccountCmd, values, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const searchUserID = "SELECT id from users where unqiue_name =? ";
    db.query(searchUserID, [unqiueName], (err, result) => {
      if (err) throw `Database can't find user id: ${err}`;
      res.clearCookies(
        "two-auth",
        {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          maxAge: 1000 * 60 * 5,
        }
      );

      createSession(res, result[0]["id"]);
      res.send("The account has been created successfully!");
    });
  } catch (err) {
    console.error(`Error with createAccount fn: ${err}`);
    res.status(405).json(err);
  }
}

export { createAccount };
