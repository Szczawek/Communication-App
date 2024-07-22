import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "./logout";
import { UserFunctions } from "../App";
export default function NavSettingsList({ user, notification }) {
  const { unqiueName, avatar } = user;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const activeElement = useRef(null);
  const parentElement = useRef(null);
  const { searchLoggedInUser } = useContext(UserFunctions);

  useEffect(() => {
    if (activeElement.current) {
      activeElement.current.focus();
    }
  }, [menuIsOpen, activeElement.current]);
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter" && !menuIsOpen) setMenuIsOpen(true);
      }}
      tabIndex={0}
      className="options">
      {menuIsOpen ? (
        <ul
          ref={parentElement}
          onBlur={(e) => {
            if (
              !e.relatedTarget ||
              !parentElement.current.contains(e.relatedTarget)
            ) {
              setMenuIsOpen(false);
            }
          }}
          className="nav_setting">
          <li className="profile-link">
            <Link
              ref={activeElement}
              onClick={() => {
                setMenuIsOpen(false);
              }}
              to={unqiueName}>
              <div className="avatar">
                <img src={avatar} alt="avatar" />
              </div>
            </Link>
          </li>
          <hr className="line" />
          <li className="link"> 
            <Link>
              Notification{" "}
              <small className="notification">
                {notification === 0
                  ? ""
                  : notification > 99
                  ? 99
                  : notification}
              </small>
            </Link>
          </li>
          <li className="link">
            <Link to={"settings"}>Setting</Link>
          </li>
          <li className="link">
            <Link>Contact</Link>
          </li>
          <li className="link">
            <button
              className="logout-btn"
              onClick={() => logout(searchLoggedInUser)}>
              Logout
            </button>
          </li>
        </ul>
      ) : (
        <div className="avatar" onClick={() => setMenuIsOpen(true)}>
          <img src={!avatar ? "./images/user.jpg" : avatar} alt="avatar" />
        </div>
      )}
    </div>
  );
}
