import { db } from "../../api-config/dbConfig.js";
async function removeFriend(from, to, resolve, reject) {
  const command = "DELETE FROM user_friends WHERE personID =? AND friendID =?";
  const values = [from, to];
  db.query(command, values, (err) => {
    if (err) return reject(`Error with removeFriend: ${err}`);
    resolve();
  });
}
export { removeFriend };
