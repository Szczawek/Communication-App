import { useEffect, useRef, useState } from "react";
import Messages from "../mess/Messages";
import waitingForMessage from "./waitingForMessage";
export default function Home({ id }) {
  // const [ws, setWs] = useState(null);  
  const effect = useRef(false);

  useEffect(() => {
    if (effect.current) return;
    const ws = waitingForMessage(id);
    return () => (effect.current = true);
  }, []);

  return (
    <div className="home">
      <Messages />
    </div>
  );
}
