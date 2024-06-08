import { useEffect, useRef, useState } from "react";

export default function useFetchMessages(ownerID, recipientID,index) {
  const [userMessages, setUserMessages] = useState([]);
  const effect = useRef(false);
  const currentUser = useRef(recipientID);

  function addMessage(message) {
    setUserMessages((prev) => [...prev, message]);
  }

  // Dynamic loading 
  async function refreshMessages() {
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

  async function loadMessages() {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_URL
        }/download-messages/${ownerID}/${recipientID}/${index}`
      );
      if (res.status === 204) return;
      if (!res.ok) throw res.status;
      const obj = await res.json();
      setUserMessages((prev) => [...obj.reverse(), ...prev]);
    } catch (err) {
      throw Error(`Error with fetching user messages from server!: ${err}`);
    }
  }

  useEffect(() => {
    if (effect.current && currentUser.current === recipientID) return;

    loadMessages();
    return () => (effect.current = true);
  }, []);

  return { userMessages, addMessage, refreshMessages };
}
