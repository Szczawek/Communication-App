import { useEffect, useRef, useState } from "react";
import MessageTools from "./MessageTools";
import useWaitingForMessage from "../main-component/waitingForMessage";

export default function Messages({ ownerID, recipientID }) {
  const [messages, setMessages] = useState([]);
  const effect = useRef(false);
  const messContainer = useRef(null);
  const wsInfo = useWaitingForMessage(ownerID,refreshMessages);
  useEffect(() => {
    console.log(1)
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
    // setMessages([])
    effect.current = false;
  }

  function addMessage(mess) {
    setMessages((prev) => [...prev, mess]);
    // messContainer.current.scrollTop = messContainer.current.scrollHeight;
  }
  return (
    <div className="container">
      <div>
        {!messages[0] && <p className="empty">Empty...</p>}
        <div className="messages" ref={messContainer}>
          {messages.map((e) => {
            return (
              <p
                key={e["date"]}
                className={`${
                  e["ownerID"] === ownerID ? "right" : "left"
                } text`}>
                {e["message"]}
              </p>
            );
          })}
        </div>
      </div>
      <MessageTools
        addMessage={addMessage}
        ownerID={ownerID}
        recipientID={recipientID}
      />
    </div>
  );
}
