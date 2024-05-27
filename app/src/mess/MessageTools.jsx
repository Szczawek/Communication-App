import { useState } from "react";

export default function MessageTools({ ownerID, recipientID }) {
  const [value, setValues] = useState("");
  async function sendMessage() {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/send-message`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ownerID, recipientID, message: value }),
      });
      console.log("Messagfe was sended sucessfully!");
    } catch (err) {
      throw err;
    }
  }
  return (
    <div className="tools">
      <label htmlFor="create-mess">
        <input
          value={value}
          onChange={(e) => setValues(e.target.value)}
          placeholder="Aaa"
          id="create-mess"
          type="text"
        />
      </label>
      <button onClick={() => sendMessage()}>Send X</button>
    </div>
  );
}
