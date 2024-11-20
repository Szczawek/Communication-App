import { db } from "../../api-config/dbConfig.js";
async function removeMsg(req, res) {
  try {
    const { id } = req.body;
    const findMsg = "DELETE FROM user_messages WHERE id =?";
    // db.query(findMsg, [id], (err) => {
    //   if (err) throw err;
      res.json("ok");
    // });
  } catch (err) {
    res.status(405).json(err);
  }
}

export { removeMsg };
