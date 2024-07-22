import { useContext, useEffect, useRef, useState } from "react";
import { UserFunctions } from "../App";
export default function InviteFromFriends({ id }) {
  const [invites, setInvites] = useState([]);
  const [confrimMessage, setConfirmMessage] = useState(false);
  const { changeFriendsList } = useContext(UserFunctions);
  const effect = useRef(false);

  async function acceptInvite(friendID) {
    try {
      const data = {
        action: "add",
        personID: id,
        friendID,
      };
      const transferOptions = {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
          token: localStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${import.meta.env.VITE_URL}/friends-list-change`,
        transferOptions
      );
      if (!res.ok) throw res.status;
      changeFriendsList("add", id);
      setConfirmMessage(true);
      setTimeout(() => {
        setConfirmMessage(false);
      }, 3000);
    } catch (err) {
      console.error(`Error with accepty invite from friend: ${err}`);
    }
  }

  async function loadInvites() {
    try {
      const transferOptions = {
        headers: {
          token: localStorage.getItem("session"),
        },
        credentials: "include",
      };
      const res = await fetch(
        `${import.meta.env.VITE_URL}/invite-from-friends/${id}`,
        transferOptions
      );
      if (!res.ok) {
        console.log(res.status);
        if (res.status === 404) return;
        throw res.status;
      }
      const obj = await res.json();
      console.log(obj);
      setInvites([...obj]);
    } catch (err) {
      console.error(`Error with loading friends list:  ${err}`);
    }
  }
  useEffect(() => {
    if (effect.current) return;
    loadInvites();
    return () => (effect.current = true);
  }, []);
  return (
    <div className="invite-from-friends">
      <div className="invite-list">
        {confrimMessage && (
          <p className="confrim-message"> You have accepted invite!</p>
        )}
        {invites.map((e, index) => {
          return (
            <div className="invite" key={index}>
              <p>{e["name"]}</p>
              <p>{index}</p>
              <p>{e["unqiue_name"]}</p>
              <button
                disabled={confrimMessage ? true : false}
                className="confirm"
                onClick={() => acceptInvite(e["id"])}>
                Accept invite
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
