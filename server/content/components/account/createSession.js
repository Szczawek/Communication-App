import { encrypt } from "../../api-config/hashFunctions.js";

function createSession(res, id) {
    res.cookie("user_id", encrypt(String(id), process.env.COOKIES_KEY), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }

  export {createSession}