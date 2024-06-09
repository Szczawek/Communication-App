import { useState } from "react";

export default function useWaitingForMessage(id, refreshMessages) {
  const [value, setValue] = useState(null);
  if (!id || id === 0) return;
    const ws = new WebSocket(`wss://localhost?user=${id}`);
  ws.onerror = (e) => {
    console.error("Error with WebSocktet!");
  };

  ws.onmessage = async (e) => {
    await refreshMessages();
    setValue((prev) => !prev);
    console.log("Message:", e.data);
  };

  ws.onclose = (e) => {
    console.log("Conection was closed!");
  };
  return value;
}
