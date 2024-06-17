import express from "express";
import { rateLimit } from "express-rate-limit";
import crypto from "crypto";
import "dotenv/config";
import { rejects } from "assert";

const app = express();
app.use(express.json());

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
  return iv.toString("hex") + ":" + encrypted + ":" + tag.toString("hex");
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
    throw Error("nie wiem co zrobić");
  }
}
let password;

app.get("/login", async (req, res) => {
  password = encrypt("nie wiem", process.env.SESSION_KEY);
  res.send("login");
});

app.get("/check", async (req, res) => {
  try {
    const check = decrypt(password, process.env.SESSION_KEY);
    res.send(`Test ${check}`);
  } catch (err) {
    console.error(err);
    res.sendStatus(403);
  }
});
app.get("/", (req, res) => {
  res.send("Logged user");
});

app.listen(80, () => {});
