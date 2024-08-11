import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserFunctions } from "../App";
import { loginWithGoogle } from "../../fireConf";
export default function CreateAccount() {
  const { searchLoggedInUser } = useContext(UserFunctions);
  const [loading, setLoading] = useState(false);
  const [isPasswordShowed, setIsShowedPassword] = useState(false);
  const [accountData, setAccountData] = useState({
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
    unqiueName: "",
  });
  const [warnings, setWarnings] = useState({
    emailWarning: false,
    passwordWarning: false,
    unqiueNameWarning: false,
  });
  const passwordInpElement = useRef(null);
  const confirmInpElement = useRef(null);
  const focusdElement = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { emailWarning, passwordWarning, unqiueNameWarning } = warnings;
    if (!emailWarning && !passwordWarning && !unqiueNameWarning) return;
    setWarnings((prev) => {
      const obj = {};
      Object.keys(prev).forEach((e) => {
        obj[e] = false;
      });
      return obj;
    });
  }, [accountData]);

  useEffect(() => {
    if (focusdElement.current) focusdElement.current.focus();
  }, []);

  function setFromData(e) {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
  }

  function arePasswordsTheSame(e) {
    e.preventDefault();
    const { password, confirmPassword } = accountData;
    if (password != confirmPassword)
      return setWarnings((prev) => ({ ...prev, passwordWarning: true }));
    setLoading(true);
    createNewAccount();
  }

  function showPassword() {
    setIsShowedPassword((prev) => !prev);
    const passInp = passwordInpElement.current;
    const confInp = confirmInpElement.current;
    if (isPasswordShowed) {
      passInp.type = "password";
      confInp.type = "password";
    } else {
      passInp.type = "text";
      confInp.type = "text";
    }
  }

  async function createNewAccount() {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        token: sessionStorage.getItem("session"),
      },
      credentials: "include",
      body: JSON.stringify({
        avatar: "./images/user.jpg",
        banner: "./images/banner.jpg",
        ...accountData,
      }),
    };
    try {
      const res = await fetch(
        `${process.env.VITE_URL}/create-account`,
        fetchOptions
      );
      if (!res.ok) {
        if (res.status == 400) {
          return setWarnings((prev) => ({ ...prev, emailWarning: true }));
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
      <form onSubmit={arePasswordsTheSame}>
        <header>
          <h2>Create Account</h2>
        </header>
        <div className="labels-container">
          <label htmlFor="nick">
            <input
              ref={focusdElement}
              id="nick"
              required
              placeholder="name"
              value={accountData.nick}
              onChange={setFromData}
              autoComplete={"off"}
              name="name"
              maxLength={25}
            />
          </label>
          <label htmlFor="cr-unqiue-name">
            <input
              id="cr-unqiue-name"
              required
              placeholder="unqiue name"
              value={accountData.unqiueName}
              onChange={setFromData}
              autoComplete={"off"}
              name="unqiueName"
              maxLength={25}
            />
            {warnings.unqiueNameWarning && (
              <small className="warning">
                An account with the unqiue name already exist!
              </small>
            )}
          </label>
          <label htmlFor="cr-email">
            <input
              id="cr-email"
              required
              placeholder="email"
              value={accountData.email}
              onChange={setFromData}
              type="email"
              name="email"
              maxLength={25}
            />
            {warnings.emailWarning && (
              <small className="warning">
                An account with that email already exist!"
              </small>
            )}
          </label>
          <label htmlFor="cr-password">
            <input
              id="cr-password"
              required
              placeholder="password"
              ref={passwordInpElement}
              value={accountData.password}
              onChange={setFromData}
              autoComplete="new-password"
              type="password"
              maxLength={30}
              name="password"
            />
            <small className="descryption-fn">
              Show passwords
              <button type="button" onClick={showPassword}>
                {isPasswordShowed ? (
                  <img src="../images/eye.svg" alt="show password" />
                ) : (
                  <img src="../images/closed_eye.svg" alt="show password" />
                )}
              </button>
            </small>
          </label>
          <label htmlFor="confirm-password">
            <input
              id="confirm-password"
              required
              placeholder="confirm password"
              ref={confirmInpElement}
              type="password"
              name="confirmPassword"
              value={accountData.confirmPassword}
              maxLength={30}
              onChange={setFromData}
            />
            {warnings.passwordWarning && (
              <small className="warning">The passwords aren't the same!</small>
            )}
          </label>
        </div>

        <button className="confirm" type="submit">
          {loading ? "Loading..." : "Submit"}
        </button>
        <button className="dif-sing-in" type="button" onClick={loginWithGoogle}>
          <p>Sing in with Google</p>
          <img src="/images/google.svg" alt="Sing in with Google" />
        </button>
      </form>
    </div>
  );
}
