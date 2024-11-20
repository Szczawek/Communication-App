import { db } from "../../api-config/dbConfig.js";
import bcrypt from "bcrypt"
import { createSession } from "./createSession.js";

async function login(req, res) {
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
      if (req.cookies["log_amount"]) {
        res.clearCookies("log_amount", JSON.stringify(value), {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          partitioned: true,
          maxAge: 1000 * 60 * 60,
        });
      }
      createSession(res, result[0]["id"]);
      res.send("Logged to account succesfuly");
    });
  } catch (err) {
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
}
export { login };
