import { Outlet, Link } from "react-router-dom";
import "./account.css";

export default function Account() {
  return (
    <div className="account">
      <Outlet />
      <div className="panel">
        <ul className="links-list">
          <li className="link">
            <Link to="/create-account">Create Account</Link>
          </li>
          <li className="link">
            <Link to="/">Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
