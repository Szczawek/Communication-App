export async function changeFriendStatus(
  action,
  personID,
  friendID,
  changeFriendsLis
) {
  const data = { action, personID, friendID };
  try {
    const res = await fetch(`${import.meta.env.VITE_URL}/friends-list-change`, {
      method: "POST", 
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("session"),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw console.error(res.status);
    changeFriendsLis(action, friendID);
  } catch (err) {
    throw Error(`Erro with add/removing firend: ${err}`);
  }
}
