import { useEffect, useState } from "react";

export default function useFetchFriends() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchFriends() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/users`);
        if (!res.ok) return console.err(`Error: ${res.status}`);
        const obj = await res.json();
        setUsers((prev) => [...prev, ...obj]);
      } catch (err) {
        throw Error(`Error durning fetching user friends: ${err}`);
      }
    }
   return () => fetchFriends();
  }, []);
  return users;
}
