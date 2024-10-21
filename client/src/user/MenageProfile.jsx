import { useEffect, useState } from "react";

export default function MenageProfile({ from, to }) {
  const [value, setValue] = useState("");
  const [action, setAction] = useState("");
  const [antySpam, setAntySpam] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const options = {
          headers: {
            token: sessionStorage.getItem("session"),
          },
          credentials: "include",
        };
        const res = await fetch(
          `${process.env.VITE_URL}/api/check-invite-status/${from}/${to}`,
          options
        );
        if (!res.ok) {
          if (res.status == 404) {
            setAction("invite");
            return setValue("add");
          }
          throw res.status;
        }
        setValue("cancel");
        setAction("cancel");
        const obj = await res.json();
        console.log(obj);
      } catch (err) {
        console.log(err);
        setAntySpam(true);
        setValue("Error");
      }
    }
    checkStatus();
  }, []);

  async function friendMenage() {
    try {
      const res = await fetch(`${process.env.VITE_URL}/api/play-with-friend`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify({
          inviting: from,
          recipient: to,
          action: action,
        }),
      });
      if (!res.ok) throw res.status;
      const obj = await res.json();
      console.log(obj);
      setAntySpam(true);
      setTimeout(() => {
        setAntySpam(false);
      }, 1500);
      if (value == "cancel") {
        setAction("add");
        return setValue("add");
      }
      setValue("cancel");
      setAction("cancel");
    } catch (err) {
      throw Error(`Error with add/remove firend with firends list: ${err}`);
    }
  }
  return (
    <button disabled={antySpam} onClick={friendMenage}>
      {value}
    </button>
  );
}
