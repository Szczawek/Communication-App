import { useEffect, useRef, useState } from "react";
export default function Home({ id }) {
  const [userFriends, setUserFriends] = useState([]);
  const effect = useRef(false);

  useEffect(() => {
    if (effect.current) return;
    async function loadUserFriends() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/users/${id}`);
        if (!res.ok) throw console.error(res.status);
        const obj = await res.json();
        setUserFriends((prev) => [...prev, ...obj]);
      } catch (err) {
        throw Error(`Error with dowloading user friends: ${err}`);
      }
    }
    return () => (effect.current = true);
  }, []);

  return (
    <div className="home">
      <ul>
        {!userFriends[0] && <p>Empty...</p>}
        {userFriends.map((e) => {
          return <li key={e["date"]}>{e["nick"]}</li>;
        })}
      </ul>
    </div>
  );
}
