import { useRef, useState } from "react";

export default function ConfirmCode() {
  const [code, setCode] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const activeElement = useRef(null);
  async function checkCode(e) {
    e.preventDefault();
    try {
      let codeAsString = "";
      for (const [key, value] of Object.entries(code)) {
        codeAsString += value;
      }

      console.log(Number(codeAsString));
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-type": "applicaition/json",
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify({ code: Number(codeAsString) }),
      };
      // const res = await fetch(`${process.env.VITE_URL}/confirm-code`,fetchOptions)
      // if(!res.ok) throw res.status
    } catch (err) {
      console.error(`Error wiith code: ${err}`);
    }
  }
  function putNumber(e) {
    const { value, name } = e.target;

    setCode((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function onlyNumberAvaliable(e) {
    const acceptable = ["ArrowRight", "ArrowLeft", "WhiteSpace", "Backspace"];
    if (!acceptable.includes(e.key) && isNaN(Number(e.key)))
      return e.preventDefault();
  }
  return (
    <div className="confirm-code">
      <header className="desc-title">
        <h2>Enter Code From Your Email</h2>
        <p>You have 5 min</p>
      </header>
      <form className="code-form" onSubmit={checkCode}>
        <div className="code-container">
          {[...new Array(6)].map((e, index) => {
            return (
              <label
                className="code-label"
                key={index + Date.now()}
                htmlFor={`code-inp-${index}`}>
                <input
                  id={`code-inp-${index}`}
                  required
                  maxLength={1}
                  minLength={1}
                  name={index}
                  value={code[index]}
                  pattern="\d"
                  onKeyDown={onlyNumberAvaliable}
                  onChange={putNumber}
                  type="text"
                />
              </label>
            );
          })}
        </div>
        <button className="confirm-code-btn" type="submit">Confirm</button>
      </form>
    </div>
  );
}
