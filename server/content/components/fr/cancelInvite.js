import { db } from "../../api-config/dbConfig.js";
async function cancelInvite(from, to, resolve, reject) {
  const command = "DELETE FROM friend_invite WHERE inviting =? AND recipient =?";
  const values = [from, to];
  db.query(command, values, (err) => {
    if (err) return reject(`Error with cancelInvite: ${err}`);
    resolve();
  });
}
export { cancelInvite };
