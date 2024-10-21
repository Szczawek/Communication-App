import { cancelInvite } from "./cancelInvite.js";
import { sendInviteToPerson } from "./sendInviteToPerson.js";
import { removeFriend } from "./removeFriend.js";
import { addFriend } from "./addFriend.js";

async function playWithFriend(req, res) {
  try {
    const { inviting, recipient, action } = req.body;
    console.log(action)
    await new Promise((resolve, reject) => {
      const arg = [inviting, recipient, resolve, reject];
      switch (action) {
        case "remove":
          removeFriend(...arg);
          break;
        case "add":
          addFriend(...arg);
          break;
        case "invite":
          sendInviteToPerson(...arg);
          break;
        case "cancel":
          cancelInvite(...arg);
          break;
      }
    });
    res.json("ok");
  } catch (err) {
    console.error(err);
    res.json("What are you looking at?");
  }
}

export { playWithFriend };
