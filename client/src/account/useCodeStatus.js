import { useEffect, useRef, useState } from "react";

function useCodeStatus() {
  const [loading, setLoading] = useState(true);
  const [codeExist, setCodeExist] = useState(false);
  const effect = useRef(false);
  useEffect(() => {
    if (effect.current) return;
    async function loadStatus() {
      try {
        const options = {
          headers: { token: sessionStorage.getItem("session") },
          credentials: "include",
        };
        const res = await fetch(
          `${process.env.VITE_URL}/is-code-exist`,
          options
        );
        if (!res.ok) throw res.status;
        const obj = await res.json();
        console.log(obj);
        setCodeExist(true);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        effect.current = true;
      }
    }
    loadStatus();
  }, []);

  return [loading, codeExist];
}
export { useCodeStatus };
