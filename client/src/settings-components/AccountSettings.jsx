import { useContext, useEffect, useRef, useState } from "react";
import { UserFunctions } from "../App";

export default function AccountSettings() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState(false);
  const { id } = useContext(UserFunctions)["loggedInUser"];
  const elementToFocus = useRef(null);

  useEffect(() => {
    if (elementToFocus.current) elementToFocus.current.focus();
  }, []);

  useEffect(() => {
    if (warning) setWarning(false);
  }, [email]);
  async function editUserData() {
    try {
      const data = { name: userName, password, email, id };
      const transferSettings = {
        method: "PUT",
        headers: {
          "Content-type": "Application/json",
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.VITE_URL}/api/edit-profile`,
        transferSettings
      );
      if (!res.ok) {
        if (res.status === 409) return setWarning(true);
        throw res.status;
      }
      setEmail("");
      setUserName("");
      setPassword("");
      setConfirmMessage(true);
      setTimeout(() => {
        setConfirmMessage(false);
      }, 3000);
    } catch (err) {
      console.error(`Error with sends datas to server: ${err}`);
    }
  }

  function checkFormValidity(e) {
    e.preventDefault();
    if (!e.target.checkValidity()) return setWarning(true);
    if (userName == "" && password == "" && email == "") return;
    editUserData();
  }

  return (
    <div className="account-settings">
      <header className="form-title">
        <h2>Account</h2>
        <p>Edit your profile data</p>
      </header>
      <form className="edit-data" onSubmit={checkFormValidity}>
        {confirmMessage && <p className="succeded-message">Succeeded</p>}
        <label htmlFor="new-name">
          User Name
          <input
            ref={elementToFocus}
            disabled={confirmMessage ? true : false}
            minLength={6}
            maxLength={25}
            value={userName}
            autoComplete="off"
            onChange={(e) => setUserName(e.target.value)}
            id="new-name"
            type="text"
            placeholder="User name..."
          />
        </label>
        <label htmlFor="new-email">
          Email
          {warning && (
            <small className="warning">
              Account with the email already exist!
            </small>
          )}
          <input
            disabled={confirmMessage ? true : false}
            type="email"
            id="new-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            minLength={3}
            maxLength={30}
            placeholder="Email..."
          />
        </label>
        <label htmlFor="new-password">
          Password
          <input
            disabled={confirmMessage ? true : false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            autoComplete="new-password"
            id="new-password"
            minLength={8}
            maxLength={25}
            placeholder="Password..."
          />
        </label>
        <label htmlFor="">
          Confirm Password
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={25}
            placeholder="Password..."
          />
        </label>
        <button className="confirm" type="submit">
          Confirm
        </button>
      </form>
    </div>
  );
}
