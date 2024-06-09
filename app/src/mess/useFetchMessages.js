import { useEffect, useRef, useState } from "react";

export default function useFetchMessages(ownerID, recipientID) {
  const [userMessages, setUserMessages] = useState([]);
  const [limit, setLimit] = useState(0);
  const effect = useRef(false);
  const currentUser = useRef(recipientID);

  function addMessage(message) {
    setUserMessages((prev) => [...prev, message]);
  }

  // Dynamic loading
  async function lastMessageRefresh() {
    if (ownerID === recipientID) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL}/last-message/${ownerID}/${recipientID}`
      );
      if (!res.ok) throw Error(res.status);
      const obj = await res.json();
      setUserMessages((prev) => [...prev, ...obj]);
    } catch (err) {
      throw Error(`Error with last message: ${err}`);
    }
  }

  async function loadMessages(index) {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_URL
        }/download-messages/${ownerID}/${recipientID}/${index}`
      );
      if (res.status === 204) return;
      if (!res.ok) throw res.status;
      const obj = await res.json();

      setUserMessages((prev) => [...obj["messages"].reverse(), ...prev]);
      setLimit(obj["limit"]);
    } catch (err) {
      throw Error(`Error with fetching user messages from server!: ${err}`);
    }
  }

  return { userMessages, addMessage, lastMessageRefresh, loadMessages, limit };
}
