import { db } from "../../api-config/dbConfig.js   ";
async function sendInviteToPerson(from, to, resolve, reject) {
  const values = [from, to, new Date()];
  const command =
    "INSERT INTO friend_invite(inviting,recipient,date) VALUES(?,?,?)";
  db.query(command, values, (err) => {
    if (err) return reject(`Error with sendInviteToPerson: ${err}`);
    resolve();
  });
}

export { sendInviteToPerson };
