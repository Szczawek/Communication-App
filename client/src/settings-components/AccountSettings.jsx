import { useContext, useEffect, useRef, useState } from "react";
import { UserFunctions } from "../App";

export default function AccountSettings() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warnings, setWarnings] = useState({
    email: false,
    password: false,
  });
  const [confirmMessage, setConfirmMessage] = useState(false);
  const { id } = useContext(UserFunctions)["loggedInUser"];
  const elementToFocus = useRef(null);

  useEffect(() => {
    if (elementToFocus.current) elementToFocus.current.focus();
  }, []);

  useEffect(() => {
    if (warnings.email || warnings.password)
      setWarnings({ email: false, password: false });
  }, [email, password, confirmPassword]);

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
        if (res.status === 409)
          return setWarnings((prev) => ({ ...prev, email: true }));
        throw res.status;
      }
      clear();
      setTimeout(() => {
        setConfirmMessage(false);
      }, 1500);
    } catch (err) {
      console.error(`Error with sends datas to server: ${err}`);
    }
  }

  function clear() {
    setEmail("");
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setConfirmMessage(true);
  }

  function checkFormValidity(e) {
    e.preventDefault();
    if (!e.target.checkValidity())
      return setWarnings({ email: true, password: true });
    if (
      userName == "" &&
      email == "" &&
      (password == "" || confirmPassword == "")
    )
      return;
    if (password != confirmPassword)
      return setWarnings((prev) => ({ ...prev, passord: true }));
      console.log(1)
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
            minLength={1}
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
          {warnings.email && (
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
            id="new-password"
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={25}
            placeholder="Password..."
          />
        </label>
        <label htmlFor="second_password">
          Confirm Password
          {warnings.password && (
            <small className="warning">
              The password and the confirm password must be the same!
            </small>
          )}
          <input
            id="second_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={25}
            placeholder="Confirm password..."
          />
        </label>
        <button className="confirm" type="submit">
          Confirm
        </button>
      </form>
    </div>
  );
}
