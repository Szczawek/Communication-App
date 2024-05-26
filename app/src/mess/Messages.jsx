import { useEffect, useRef, useState } from "react";
import "./home.css";
export default function Messages() {
  const [messages, setMessages] = useState([]);
  const effect = useRef(false);

  useEffect(() => {
    if (effect.current) return;
    async function downloadMessages() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}/download-messages/12/11`
        );
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
      <h2>Messages</h2>
      <div className="messages">
        {messages.map((e, index) => {
          return (
            <p key={index} className="text">
              {e["message"]}
            </p>
          );
        })}
      </div>
    </>
  );
}
