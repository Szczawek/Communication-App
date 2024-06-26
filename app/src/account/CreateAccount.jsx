import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserFunctions } from "../App";
export default function CreateAccount() {
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [unqiueName, setUnqiueName] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const { searchLoggedInUser } = useContext(UserFunctions);
  const focusdElement = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (warning) setWarning(false);
  }, [email, password]);

  useEffect(() => {
    if (focusdElement.current) focusdElement.current.focus();
  }, []);

  async function reqCreateAccount(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        nick,
        email,
        unqiueName,
        password,
      };
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: localStorage.getItem("session"),
        },
        credentials: "include",

        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${import.meta.env.VITE_URL}/create-account`,
        fetchOptions
      );
      if (!res.ok) {
        if (res.status == 400) {
          return setWarning(true);
        }
        throw console.error("Error with server");
      }
      setLoading(false);
      await searchLoggedInUser();
      navigate("/info");
    } catch (err) {
      throw Error(`Error with account-creator: ${err}`);
    }
  }
  return (
    <div className="create_account">
      <form onSubmit={(e) => reqCreateAccount(e)}>
        <header>
          <h2>Create Account</h2>
        </header>
        <div className="labels">
          <label htmlFor="nick">
            <input
              ref={focusdElement}
              required
              placeholder="nick"
              id="nick"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
            />
          </label>
          <label htmlFor="cr-unqiue-name">
            <input
              required
              placeholder="unqiue name"
              id="cr-unqiue-name"
              value={unqiueName}
              onChange={(e) => setUnqiueName(e.target.value)}
            />
          </label>
          <label htmlFor="cr-email">
            <input
              required
              placeholder="email"
              id="cr-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </label>
          <label htmlFor="cr-password">
            <input
              required
              placeholder="password"
              id="cr-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </label>
          <small className="warning">
            {warning && "Email or Password are invalid!"}
          </small>
        </div>
        <button className="confirm" type="submit">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
