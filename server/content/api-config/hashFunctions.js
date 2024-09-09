import crypto from "crypto";
function confirmEmailCode() {
  let code = "";
  while (true) {
    code += Math.floor(Math.random() * 10);
    if (code.length == 6) break;
  }
  return code;
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
export { confirmEmailCode, decrypt, encrypt };
