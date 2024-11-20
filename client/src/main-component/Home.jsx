import { useEffect, useState } from "react";
import ProfileLink from "./ProfileLink";
import "./home.css";

export default function Home({ id }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  async function loadActiveConv() {
    try {
      const options = {
        headers: {
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
      };
      const res = await fetch(
        `${process.env.VITE_URL}/api/active-conversations/${id}`,
        options
      );
      console.log(res.status);
      if (!res.ok) {
        if(res.status == 404) return
        throw res.status;
      }
      const obj = await res.json();
      setUsers(obj);
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadActiveConv();
  }, []);

  console.log(error);
  if (error) return <p>Error</p>;
  return (
    <div className="home">
      {loading ? (
        <p>Loading ...</p>
      ) : !users[0] ? (
        <p>Empty</p>
      ) : (
        users.map((e) => {
          return <ProfileLink key={e.date} data={e} />;
        })
      )}
    </div>
  );
}
