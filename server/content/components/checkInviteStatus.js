import { db } from "../api-config/dbConfig.js";
async function checkInviteStatus(req, res) {
  try {
    const { inviting, recipient } = req.params;
    const command =
      "SELECT * FROM friend_invite WHERE inviting =? AND recipient =?";
    const values = [inviting, recipient];
    db.query(command, values, (err, result) => {
      if (err) throw err;
      if (!result[0]) return res.sendStatus(404);
      res.json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(400).json("Error");
  }
}

export { checkInviteStatus };
