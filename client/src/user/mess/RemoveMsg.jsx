import { useState } from "react";

export default function RemoveMsg({ id,removeFromList }) {
  const [showOptions, setShowOptions] = useState(false);

  async function removeMsg() {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      };
      const res = await fetch(
        `${process.env.VITE_URL}/api/remove-msg`,
        options
      );
      if (!res.ok) throw res.status;
      removeFromList(id)
      console.log("ok");
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div onBlur={() => setShowOptions(false)} className="msg-options">
      {!showOptions ? (
        <button className="open-options" onClick={() => setShowOptions(true)}>
          <img src="/images/three-dots.svg" alt="open msg menu" />
        </button>
      ) : (
        <button onClick={removeMsg} className="remove-msg">
          <img src="/images/trash.svg" alt="delete msg" />
          Delete
        </button>
      )}
    </div>
  );
}
