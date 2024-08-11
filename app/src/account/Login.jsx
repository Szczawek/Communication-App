import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserFunctions } from "../App";
export default function Login() {
  const [email, setEmail] = useState("");
  const [isPasswordShowed, setIsShowedPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const focusdElement = useRef(null);
  const passwordInpElement = useRef(null);
  const navigate = useNavigate();
  const { searchLoggedInUser } = useContext(UserFunctions);
  useEffect(() => {
    if (focusdElement.current) focusdElement.current.focus();
  }, []);

  useEffect(() => {
    if (warning) setWarning(false);
  }, [email, password]);

  function showPassword(e) {
    e.preventDefault();
    setIsShowedPassword((prev) => !prev);
    const passInp = passwordInpElement.current;
    if (isPasswordShowed) {
      passInp.type = "password";
    } else {
      passInp.type = "text";
    }
  }

  async function loginToAccount(e) {
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
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.VITE_URL}/login`,
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
      <form autoComplete={"on"} onSubmit={loginToAccount}>
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
        <div className="labels-container">
          <label htmlFor="login-ac">
            <input
              id="login-ac"
              required
              ref={focusdElement}
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              maxLength={25}
            />
          </label>
          <label htmlFor="password-ac">
            <input
              id="password-ac"
              ref={passwordInpElement}
              required
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              maxLength={30}
            />
            <button type="button" className="eye" onClick={showPassword}>
              {isPasswordShowed ? (
                <img src="../images/eye.svg" alt="hide password" />
              ) : (
                <img src="../images/closed_eye.svg" alt="show password" />
              )}
            </button>
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
