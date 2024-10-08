export async function loadLastMessage(ownerID, recipientID) {
  try {
    const res = await fetch(
      `${process.env.VITE_URL}/api/last-message/${ownerID}/${recipientID}`,
      {
        credentials: "include",
        headers: { token: sessionStorage.getItem("session") },
      }
    );
    if (!res.ok) throw Error(res.status);
    const obj = await res.json();
    console.log(obj);
    return obj;
  } catch (err) {
    throw Error(`Error with last message: ${err}`);
  }
}
