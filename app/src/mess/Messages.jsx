import { useEffect, useRef, useState } from "react";
import MessageTools from "./MessageTools";

export default function Messages({ ownerID, recipientID }) {
  const [messages, setMessages] = useState([]);
  const effect = useRef(false);

  useEffect(() => {
    if (effect.current) return;
    async function loadMess() {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_URL
          }/download-messages/${ownerID}/${recipientID}`
        );
        if (res.status === 204) return;
        if (!res.ok) return console.error(`${err}`);
        const obj = await res.json();
        setMessages((prev) => [...prev, ...obj]);
      } catch (err) {
        throw Error(`Erro with loading messages: ${err}`);
      }
    }
    loadMess();
    return () => (effect.current = true);
  }, []);

  function refreshMessages() {
    effect.current = false;
  }
  return (
    <div className="container">
      <div>
        {!messages[0] && <p className="empty">Empty...</p>}
        <div className="messages">
          {messages.map((e) => {
            return (
              <p key={e["date"]} className="text">
                {e["message"]}
              </p>
            );
          })}
        </div>
      </div>
      <MessageTools ownerID={ownerID} recipientID={recipientID} />
    </div>
  );
}
