import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function useUserSearch(stopLoadingScreen) {
  const [user, setUser] = useState();
  const { nick } = useParams();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(
          `${process.env.VITE_URL}/api/user-search/${nick}`,
          {
            credentials: "include",
            headers: { token: sessionStorage.getItem("session") },
          }
        );

        if (!res.ok) return console.error(`Error: ${res.status}`);
        if (res.status === 204) return;
        const obj = await res.json();
        setUser(obj);
      } catch (err) {
        throw Error(`An error occurs when searching for a user: ${err}`);
      } finally {
        stopLoadingScreen();
      }
    }
    fetchUser();
  }, [nick]);

  return user;
}
