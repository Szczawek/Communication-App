import { Link } from "react-router-dom";
export default function NavSettingsList({ user }) {
  const { id, unqiueName, avatar } = user;
  return (
    <ul className="nav_setting">
      <li className="main_option">
        <Link to={id != 0 ? `/${unqiueName}` : "/login"}>
          {id != 0 ? (
            <div className="avatar">
              <img src={avatar} alt="avatar" />
            </div>
          ) : (
            <p>Login</p>
          )}
        </Link>
      </li>
      <p>ss</p>
    </ul>
  );
}
