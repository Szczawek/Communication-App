import { useContext, useEffect, useRef, useState } from "react";
import { UserFunctions } from "../App";
export default function InviteFromFriends({ id }) {
  const [invites, setInvites] = useState([]);
  const [confrimMessage, setConfirmMessage] = useState(false);
  const { changeFriendsList } = useContext(UserFunctions);
  const [loading, setLoading] = useState(true);
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
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.VITE_URL}/api/friends-list-change`,
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
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
      };
      const res = await fetch(
        `${process.env.VITE_URL}/api/invite-from-friends/${id}`,
        transferOptions
      );
      if (!res.ok) {
        if (res.status === 404) return setLoading(false);
        throw res.status;
      }
      const obj = await res.json();
      setLoading(false);
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
      {!invites[0] && !loading ? (
        <p className="empty-list">Empty invite list</p>
      ) : null}
    </div>
  );
}
