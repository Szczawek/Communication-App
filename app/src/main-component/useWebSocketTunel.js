import { useEffect, useState } from "react";

export default function useWebSocketTunel(id, menageNotificaion) {
  const [wss, setWss] = useState();
  useEffect(() => {
    if (id === 0) return;
    const wss = new WebSocket(`wss://${process.env.VITE_DOMAIN}/?userID=${id}`);
    setWss(wss);
    wss.onopen = (e) => {
      console.log("conncected");
    };

    wss.onclose = (e) => {
      console.log("closed");
    };

    wss.onmessage = (e) => {
      menageNotificaion("add", 1);
      console.log("new messgae");
    };
  }, [id]);
  return wss;
}
