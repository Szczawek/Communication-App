import { useEffect, useRef, useState } from "react";

export default function InviteFromFriends({ id }) {
  const [invites, setInvites] = useState([]);
  const effect = useRef(false);
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
        {invites.map((e, index) => {
          return (
            <div className="invite" key={index}>
              <p>{e["name"]}</p>
              <p>{index}</p>
              <p>{e["unqiue_name"]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
