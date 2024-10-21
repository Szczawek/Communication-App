import { useEffect, useState } from "react";
import ProfileLink from "../main-component/ProfileLink";
export default function WaitingForAccept({ id }) {
  const [waiters, setWaiters] = useState([]);
  async function loadWaiters() {
    try {
      const options = {
        headers: {
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
      };
      const res = await fetch(
        // `${process.env.VITE_URL}/api/`,
        options
      );
      if (!res.ok) throw res.status;
      const obj = await res.json();
      setWaiters(obj);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    loadWaiters();
  }, []);
  return (
    <div className="waiting-for-accept">
      {waiters.map((e) => {
        return (
          <div key={e["date"]}>
            <ProfileLink data={e} />
            <button className="remove-friend">Remove</button>
          </div>
        );
      })}
    </div>
  );
}
