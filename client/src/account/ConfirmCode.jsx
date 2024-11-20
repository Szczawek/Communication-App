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
  const [activeFild, setActiveField] = useState(0);
  const activeElement = useRef(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeElement.current) activeElement.current.focus();
  }, [activeFild]);

  async function sendCode(e) {
    e.preventDefault();
    try {
      let codeAsString = "";
      for (const [key, value] of Object.entries(code)) {
        codeAsString += value;
      }
      await isCodeCorrect(Number(codeAsString));
      console.log("New account was created!")
    } catch (err) {
      if(err == 401) {
        return console.log("Time has passed!")
      } 
      console.error(err);
    }
  }
  function putNumber(e) {
    const { value, name } = e.target;
    setCode((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (activeFild < 5 && value !== "") {
      setActiveField((prev) => prev + 1);
    }
  }

  function onlyNumberAvaliable(e) {
    const acceptable = [
      "ArrowRight",
      "ArrowLeft",
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "Backspace",
    ];
    if (!acceptable.includes(e.key) && isNaN(Number(e.key))) {
      return e.preventDefault();
    }
    switch (e.key) {
      case "ArrowUp":
        if (activeFild < 5) {
          setActiveField((prev) => prev + 1);
          return;
        }
        setActiveField(0);
        break;
      case "ArrowDown":
        if (activeFild > 0) {
          return setActiveField((prev) => prev - 1);
        }
        setActiveField(5);
        break;
    }
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
                ref={index == activeFild ? activeElement : null}
                className="code-label"
                onClick={() => setActiveField(index)}
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
