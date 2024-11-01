import { db } from "../../api-config/dbConfig.js   ";
async function addFriend(from, to, resolve, reject) {
  const values = [from, to, new Date()];
  const command =
    "INSERT INTO user_friends(personID,friendID,date) VALUES(?,?,?)";
  db.query(command, values, (err) => {
    if (err) return reject(`Error with addFriend: ${err}`);
    resolve();
  });
}

export { addFriend };
