import { useEffect, useState } from "react";

export default function useWebSocketTunel(id, menageNotificaion) {
  const [wss, setWss] = useState();
  useEffect(() => {
    if (id === 0) return;
    console.log(1)
    const wss = new WebSocket(`wss://${process.env.VITE_WS_DOMAIN}/?user=${id}`);
    setWss(wss);
    wss.onopen = (e) => {
      console.log("conncected");
    };

    wss.onclose = (e) => {
      console.log(e)
      console.log("closed");
    };

    wss.onmessage = (e) => {
      menageNotificaion("add", 1);
      console.log("new messgae");
    };
  }, [id]);
  return wss;
}
