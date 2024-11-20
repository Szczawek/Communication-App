import { confirmCodeHTML } from "../../confirmCodeHTML.js";
import { sendEmail } from "../../sendEmail.js";
import { encrypt } from "../../api-config/hashFunctions.js";
import "dotenv/config";

async function sendEmailCode(req, res) {
  try {
    const { email } = req.body;
    const codeArray = [];
    while (codeArray.length < 6) {
      const randomNumber = Math.floor(Math.random() * 9);
      codeArray.push(randomNumber);
    }
    const code = codeArray.join("");
    const encryptedCode = encrypt(code, process.env.EMAIL_CODE);
    res.cookie(
      "two-auth",
      { code:encryptedCode },
      { sameSite: "none", secure: true, httpOnly: true, maxAge: 1000 * 60 * 5 }
    );
    await sendEmail(res, {
      subject: "test",
      user: email,
      html: confirmCodeHTML(code),
    });
    res.json("Code was sended successfully!");
  } catch (err) {
    console.error(err);
    res.status(401).json("Error", err);
  }
}
export { sendEmailCode };
