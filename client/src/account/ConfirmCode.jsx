import { useContext, useEffect, useRef, useState } from "react";
import { isCodeCorrect } from "./isCodeCorrect";
import { UserFunctions } from "../App";
import { useCodeStatus } from "./useCodeStatus";
import "./account.css";
import { Navigate } from "react-router-dom";
export default function ConfirmCode() {
  const [code, setCode] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [incorrectCode, setIncorrectCode] = useState(false);
  const [activeFild, setActiveField] = useState(0);
  const { searchLoggedInUser } = useContext(UserFunctions);
  const [moveToAccount, setMoveToAccount] = useState(false);
  const [comeBack, setComeBack] = useState(false);
  const [loading, isCodeExist] = useCodeStatus();
  const activeElement = useRef(null);

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
      await searchLoggedInUser();
      setMoveToAccount(true);
    } catch (err) {
      switch (err) {
        case 400:
          setIncorrectCode(true);
          break;
        case 401:
          setComeBack(true);
          break;
        default:
          console.error(err);
          setComeBack(true);
      }
    }
  }
  function putNumber(e) {
    const { value, name } = e.target;
    if (incorrectCode) setIncorrectCode(false);
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
  if (comeBack || (!isCodeExist && !loading))
    return <Navigate to={"/"} />;
  if (moveToAccount) return <Navigate to={"/"} />;
  if (loading) return <p>Loading ...</p>;
  return (
    <div className="confirm-code">
      <header className="desc-title">
        <h2>Enter Code From Your Email</h2>
        {incorrectCode && <p>Code is incorrect!</p>}
        <p>You have 5 min</p>
        <small>Pss... You can use "ctrl + v"</small>
      </header>
      <form
        onPaste={(e) => {
          const code = e.clipboardData.getData("text");
          const codeToNumber = Number(code);
          const checkType = isNaN(codeToNumber);
          if (!checkType) {
            const arr = code.split("").slice(0, 6);
            const obj = {};
            for (let i = 0; i < arr.length; i++) {
              obj[i] = arr[i];
            }
            setCode(obj);
          }
        }}
        className="code-form"
        onSubmit={sendCode}>
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
