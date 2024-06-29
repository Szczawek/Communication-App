import { useEffect, useState } from "react";

export default function useWaitingForMessage(id, refreshMessages) {
  const [ws, setWS] = useState();
  if (!id || id === 0) return;
  useEffect(() => {
    return () => setWS(new WebSocket(`wss://${import.meta.env.VITE_DOMAIN}?user=${id}`));
  }, []);
  if (ws) {
    ws.onopen = (e) => {
      console.log("connected!")
    }
    ws.onerror = (e) => {
      console.error("Error with WebSocktet!");
    };

    ws.onmessage = async (e) => {
      console.log("Messag",e.data)
      await refreshMessages();
    };

    ws.onclose = (e) => {
      console.log("Conection was closed!");
    };
  }
}
