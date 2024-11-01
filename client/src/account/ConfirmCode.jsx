import { useEffect, useRef, useState } from "react";
import { isCodeCorrect } from "./isCodeCorrect";
import "./account.css";
export default function ConfirmCode() {
  const [invalidData, setInvalidData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [incorrectCode, setInCorrectCode] = useState(false);
  const activeElement = useRef(null);

  useEffect(() => {
    setLoading(false);
  }, []);
  async function sendCode(e) {
    e.preventDefault();
    try {
      let codeAsString = "";
      for (const [key, value] of Object.entries(code)) {
        codeAsString += value;
      }

      await isCodeCorrect(Number(codeAsString));
    } catch (err) {
      console.error(err);
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

  if (loading) return <p>Loading ...</p>;

  return (
    <div className="confirm-code">
      <header className="desc-title">
        <h2>Enter Code From Your Email</h2>
        {incorrectCode && <p>Code is incorrect!</p>}
        <p>You have 5 min</p>
      </header>
      <form className="code-form" onSubmit={sendCode}>
        <div className="code-container">
          {[...new Array(6)].map((e, index) => {
            return (
              <label
                ref={index == 0 ? activeElement : null}
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
        <button className="confirm-code-btn" type="submit">
          Confirm
        </button>
      </form>
    </div>
  );
}
