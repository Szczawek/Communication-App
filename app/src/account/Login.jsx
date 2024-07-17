import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserFunctions } from "../App";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const focusdElement = useRef(null);
  const navigate = useNavigate();
  const { searchLoggedInUser } = useContext(UserFunctions);
  useEffect(() => {
    if (focusdElement.current) focusdElement.current.focus();
  }, []);

  useEffect(() => {
    if (warning) setWarning(false);
  }, [email, password]);
  async function reqLoginAccount(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        email,
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
        `${import.meta.env.VITE_URL}/login`,
        fetchOptions
      );
      setLoading(false);

      if (!res.ok) {
        if (res.status === 401) return setWarning(true);
        return console.error(`Error with login: ${res.status}}`);
      }
      await searchLoggedInUser();
      navigate("/info");
    } catch (err) {
      throw Error(`Error durning login to account: ${err}`);
    }
  }
  return (
    <div className="login">
      <form onSubmit={(e) => reqLoginAccount(e)}>
        <header>
          <h2>Login</h2>
        </header>
        <div className="build-mode">
          <h3>Prod Mod</h3>
          <p>
            login: <span>test@test</span>
          </p>
          <p>
            password: <span>test</span>
          </p>
        </div>
        <div className="labels">
          <label htmlFor="login-ac">
            <input
              ref={focusdElement}
              required
              placeholder="email"
              id="login-ac"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </label>
          <label htmlFor="password-ac">
            <input
              required
              placeholder="password"
              id="password-ac"
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
          {loading ? "loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
