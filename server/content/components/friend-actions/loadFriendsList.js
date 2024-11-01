import { db } from "../../api-config/dbConfig.js"

function loadFriendsList(req, res) {
  const { type, id } = req.params;
  console.log(type,id)
  res.json("ok");
}

export { loadFriendsList };
