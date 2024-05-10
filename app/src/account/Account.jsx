import Login from "./Login";
import { Route, Link, Routes } from "react-router-dom";
import CreateAccount from "./CreateAccount";
export default function Account() {
  return (
    <>
      <Routes>
        <Route path="create-account" element={<CreateAccount />} />
        <Route path="/" element={<Login />} />
      </Routes>
      <div className="account">
        <div className="panel">
          <ul className="links-list">
            <li className="link">
              <Link to="create-account">Create Account</Link>
            </li>
            <li className="link">
              <Link to="">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
