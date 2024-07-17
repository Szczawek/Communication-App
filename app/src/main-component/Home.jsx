import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";
export default function Home({ id }) {
  const [userFriends, setUserFriends] = useState([]);
  const effect = useRef(false);

  useEffect(() => {
    if (effect.current || id === 0) return;
    async function loadUserFriends() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/users/${id}`, {
          credentials: "include",
          headers: {
            token: localStorage.getItem("session"),
          },
        });
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
      <p className="ester-egg">You can move your friends where you want them to be placed!</p>
      <ul className="friends-list">
        {!userFriends[0] && <p>Empty...</p>}
        {userFriends.map((e, i) => {
          return (
            <li
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "text/plain",
                  JSON.stringify({ index: i })
                );
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                const { index } = JSON.parse(
                  e.dataTransfer.getData("text/plain")
                );
                setUserFriends((prev) => {
                  const copy = [...prev];
                  copy.splice(index, 1);
                  copy.splice(i, 0, userFriends[index]);

                  return copy;
                });
              }}
              className="profil-link"
              key={e["date"]}>
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
