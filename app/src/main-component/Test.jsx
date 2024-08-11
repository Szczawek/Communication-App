import { useEffect } from "react";
import { loginWithGoogle } from "../../fireConf";
export default function Test() {
  async function ts() {
    const res = await fetch(`${process.env.VITE_URL}/api/test`, {
      headers: {
        token: sessionStorage.getItem("session"),
      },
      credentials: "include",
    });
    if (!res.ok) console.error(res.status);
  }
  return (
    <div className="test">
      <button onClick={ts}>Click</button>
    </div>
  );
}
