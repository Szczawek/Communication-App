import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function useUserSearch(stopLoadingScreen) {
  const [user, setUser] = useState();
  const { nick } = useParams();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}/user-search/${nick}`
        );

        if (!res.ok) {
          if (res.status === 404) return;
          return console.error(`Error: ${res.status}`);
        }
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
