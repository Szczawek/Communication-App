import { decrypt } from "../../api-config/hashFunctions.js";
import "dotenv/config"
async function checkEmailCode(req, res) {
  try {
    const correctCode = req.cookies["two-auth"];
    if (!correctCode) return res.status(401).json("The has passed!");
    const { code } = req.body;

    const decryptedCode = decrypt(correctCode.code,process.env.EMAIL_CODE)
    const decryptedCodeAsNumber = Number(decryptedCode)

    if (code != decryptedCodeAsNumber)
      return res.status(400).json("Incorrect code!");
    res.json("Ok");
  } catch (err) {
    console.log(err);
    res.status(405).json(err);
  }
}
export { checkEmailCode };
