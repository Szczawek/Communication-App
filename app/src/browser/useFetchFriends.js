import { useEffect, useRef, useState } from "react";

export default function useFetchFriends() {
  const [users, setUsers] = useState([]);
  const fetchReq = useRef(false);
  useEffect(() => {
    if (fetchReq) return;
    async function fetchFriends() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/users${12}`);
        if (!res.ok) return console.err(`Error: ${res.status}`);
        const obj = await res.json();
        fetchReq.current = true;
        setUsers((prev) => [...prev, ...obj]);
      } catch (err) {
        throw Error(`Error durning fetching user friends: ${err}`);
      }
    }
    fetchFriends();
  }, []);
  return users;
}
