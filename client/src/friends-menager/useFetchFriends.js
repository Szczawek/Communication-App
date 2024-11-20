import { useEffect, useRef, useState } from "react";

export default function useFetchFriends(id, type) {
  const [list, setList] = useState([]);
  const effect = useRef(false);
  const [loading, setLoading] = useState(true);
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
      if (!res.ok) {
        if (res.status == 404) return;
        throw res.status;
      }
      const obj = await res.json();
      setList(obj)
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
      effect.current = true;
    }
  }
  useEffect(() => {
    if (effect.current) return;
    loadList();
  }, []);
  return [list, loading];
}
