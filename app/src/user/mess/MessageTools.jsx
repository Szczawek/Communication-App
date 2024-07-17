import { useEffect, useRef, useState } from "react";

export default function MessageTools({ addMessage, ownerID, recipientID }) {
  const [value, setValue] = useState("");
  const messageInput = useRef(null);
  const [slow, setSlow] = useState(false);
  const [warning, setWarning] = useState(false);

  async function sendMessage() {
    if (!messageInput.current.checkValidity()) return setWarning(true);
    setSlow(true);
    const messData = { ownerID, recipientID, message: value };
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/send-message`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: localStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify(messData),
      });
      if (!res.ok) throw console.error(res.status);
      await addMessage({ ...messData, date: new Date() });
      setValue("");
      setTimeout(() => {
        setSlow(false);
      }, 1000);
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    if (warning) setWarning(false);
  }, [value]);

  return (
    <div className="tools">
      <label
        onKeyDown={(e) => {
          if (e.key === "Enter" && !slow) sendMessage();
        }}
        htmlFor="create-mess">
        <input
          autoComplete="off"
          ref={messageInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`${warning ? "Warning" : "ZzZ..."}`}
          minLength={1}
          maxLength={500}
          required
          pattern="^(?!\s*$).+"
          id="create-mess"
          type="text"
        />
      </label>
      <button
        className="send-message"
        disabled={slow ? true : false}
        onClick={() => sendMessage()}>
        Send
      </button>
    </div>
  );
}
