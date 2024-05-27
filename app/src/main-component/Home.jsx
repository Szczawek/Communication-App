import { useEffect, useRef, useState } from "react";
import FriendsList from "../mess/FriendsList";
import waitingForMessage from "./waitingForMessage";
export default function Home({ id }) {
  const effect = useRef(false);

  useEffect(() => {
    if (effect.current) return;
    const ws = waitingForMessage(id);
    return () => (effect.current = true);
  }, []);

  return (
    <div className="home">
      <FriendsList id={id} />
    </div>
  );
}
