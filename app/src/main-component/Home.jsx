import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../mess/home.css";
export default function Home({ id }) {
  const [userFriends, setUserFriends] = useState([]);
  const effect = useRef(false);

  useEffect(() => {
    if (effect.current || id === 0) return;
    async function loadUserFriends() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/users/${id}`);
        if (res.status === 204) return;
        if (!res.ok) throw console.error(res.status);
        const obj = await res.json();
        setUserFriends((prev) => [...prev, ...obj]);
      } catch (err) {
        throw Error(`Error with dowloading user friends: ${err}`);
      }
    }
    loadUserFriends();
    return () => (effect.current = true);
  }, [id]);

  return (
    <div className="home">
      <ul className="friends-list">
        {!userFriends[0] && <p>Empty...</p>}
        {userFriends.map((e) => {
          return (
            <li className="profil-link" key={e["date"]}>
              <Link to={e["unqiue_name"]}>
                <div className="avatar">
                  <img src={e["avatar"]} alt="avatar" />
                </div>
                <div className="user-description">
                  <p className="nick">{e["nick"]}</p>
                  <p className="unqiue_name">{e["unqiue_name"]}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
