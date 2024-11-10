import { db } from "../../api-config/dbConfig.js";
async function isDataValid(req, res) {
  try {
    const { nick, unqiueName, email, password } = req.body;
    const findCopy =
      "SELECT email,unqiue_name as unqiueName FROM users WHERE unqiue_name =? OR email =?";
    const user = await new Promise((resolve, rej) => {
      db.query(findCopy, [unqiueName, email], (err, result) => {
        if (err) return rej(`Error with db ${err}`);
        resolve(result);
      });
    });
    if (user.length == 0) {
      res.cookie(
        "ac-data",
        { nick, email, unqiueName, password },
        {
          secure: true,
          httpOnly: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 6,
        }
      );
      return res.json("ok");
    }
    const invalidData = {
      unqiueName:
        user[0].unqiueName.toLowerCase() == unqiueName.toLowerCase()
          ? true
          : false,
      email: user[0].email.toLowerCase() == email.toLowerCase() ? true : false,
    };
  console.log(user)
    res.status(403).json(invalidData);
  } catch (err) {
    console.error(err);
    res.status(404).json(err);
  }
}
export { isDataValid };
