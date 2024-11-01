import { db } from "../../api-config/dbConfig.js";
async function activeConversations(req, res) {
  try {
    const { id } = req.params;
    const findActiveCon =
      "SELECT recipientID FROM messages WHERE ownerID =? AND recipientID !=? GROUP BY recipientID";
    const findActiveValues = [id, id];
    const list = await new Promise((resolve, rej) => {
      db.query(findActiveCon, findActiveValues, (err, arrWithID) => {
        if (err) return rej(`Error with db SELECT FROM MESSAGES: ${err}`);
        const filter = arrWithID.map((e) => {
          return e.recipientID;
        });
        resolve(filter);
      });
    });
    if (!list[0]) return res.status(403).json("Nothing is here!");
    const selectUsers =
      "SELECT nick,unqiue_name as unqiueName,date, avatar FROM users where id IN (?)";
    db.query(selectUsers, [list], (err, listOfUsers) => {
      if (err) throw Error(`Error with loading users from db #USERS: ${err}`);
      res.json(listOfUsers);
    });
  } catch (err) {
    console.error(err);
    res.status(405).json(err);
  }
}
export { activeConversations };
