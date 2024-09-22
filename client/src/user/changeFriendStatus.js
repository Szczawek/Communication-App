export async function changeFriendStatus(
  action,
  personID,
  friendID,
  changeFriendsLis
) {
  const data = { action, personID, friendID };
  try {
    const res = await fetch(`${process.env.VITE_URL}/api/friends-list-change`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        token: sessionStorage.getItem("session"),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw console.error(res.status);
    changeFriendsLis(action, friendID);
  } catch (err) {
    throw Error(`Erro with add/removing firend: ${err}`);
  }
}
