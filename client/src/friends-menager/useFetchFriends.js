import { useEffect, useRef, useState } from "react";

export default function useFetchFriends(id, type) {
  const [list, setList] = useState([]);
  const effect = useRef(false);
  const [loading, setLoading] = useState(true);
  console.log(effect.current)
  async function loadList() {
    try {
      const options = {
        headers: {
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
      };
      const res = await fetch(
        `${process.env.VITE_URL}/api/friends-list/${type}/${id}`,
        options
      );
      if (!res.ok) throw res.status;
      const obj = await res.json();
      console.log(obj);
      setLoading(false);
    } catch (err) {
      console.log("error", err);
    } finally {
      effect.current = true;
    }
  }
  useEffect(() => {
    console.log(id)
    if (effect.current) return;
    // console.log(effect.current)
    loadList();
  }, []);
  return [list, loading];
}
