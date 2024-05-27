import { useEffect, useRef, useState } from "react";
import "./home.css";
export default function Messages({ id }) {
  const [messages, setMessages] = useState([]);
  const effect = useRef(false);

  useEffect(() => {
    if (effect.current) return;
    async function downloadMessages() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/users/${id}`);
        if (res.status ===204) return;
        if (!res.ok) return console.error(res.status);
        const obj = await res.json();
        setMessages((prev) => [...prev, ...obj]);
      } catch (err) {
        throw Error(`Error with messages${err}`);
      }
    }
    downloadMessages();
    return () => (effect.current = true);
  }, []);

  return (
    <>
      <div className="messages-list">
        <h2>Messages</h2>
        {!messages[0] && <p>Empty</p>}
        {messages.map((e) => {
          return (
            <div key={e["date"]} className="friend">
              <div className="avatar">
                <img src={e["avatar"]} alt="avatar" />
              </div>
              <div className="info">
                <p>{e["nick"]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
