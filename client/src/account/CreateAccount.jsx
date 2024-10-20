import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserFunctions } from "../App";
import { loginWithGoogle } from "../../fireConf";
import { sendEmailCode } from "./sendEmailCode";
import { createNewAccount } from "./createNewAccount";

export default function CreateAccount() {
  const { searchLoggedInUser } = useContext(UserFunctions);
  const [loading, setLoading] = useState(false);
  const [isPasswordShowed, setIsShowedPassword] = useState(false);
  const [accountData, setAccountData] = useState({
    password: "",
    confirmPassword: "",
    email: "",
    nick: "",
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
    accountStatus();
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

  async function accountStatus() {
    try {
      await createNewAccount(accountData, setWarnings);
      await searchLoggedInUser();
      navigate("/info");
    } catch (err) {
      // to change
      // to change
      // to change
      alert("server error");
      console.error(err);
    } finally {
      setLoading(false);
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
              name="nick"
              minLength={1}
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
              minLength={3}
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
              minLength={3}
              maxLength={30}
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
          </label>
          <div className="lb-con">
            <button
              className="eye"
              tabIndex={-1}
              type="button"
              onClick={showPassword}>
              {isPasswordShowed ? (
                <img src="/images/eye.svg" alt="show password" />
              ) : (
                <img src="/images/closed_eye.svg" alt="show password" />
              )}
            </button>
            <label htmlFor="confirm-password">
              <input
                id="confirm-password"
                name="confirmPassword"
                required
                ref={confirmInpElement}
                onChange={setFromData}
                value={accountData.confirmPassword}
                type="password"
                minLength={8}
                maxLength={25}
                placeholder="Confir password..."
              />
              {warnings.passwordWarning && (
                <small className="warning">
                  The passwords aren't the same!
                </small>
              )}
            </label>
          </div>
        </div>

        <button className="confirm" type="submit">
          {loading ? "Loading..." : "Submit"}
        </button>
        <button className="dif-sing-in" type="button" onClick={loginWithGoogle}>
          <p>Google</p>
          <img src="/images/google.svg" alt="Sing in with Google" />
        </button>
      </form>
    </div>
  );
}
