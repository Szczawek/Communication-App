import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "./logout";
import { UserFunctions } from "../App";
export default function NavSettingsList({ closeMenu, user, notification }) {
  const { unqiueName, avatar } = user;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const activeElement = useRef(null);
  const parentElement = useRef(null);
  const { searchLoggedInUser } = useContext(UserFunctions);

  useEffect(() => {
    if (activeElement.current) {
      activeElement.current.focus();
    }
  }, [menuIsOpen]);
  return (
    <>
      {!menuIsOpen ? (
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter" && !menuIsOpen) setMenuIsOpen(true);
          }}
          tabIndex={0}
          className="options">
          <div className="avatar" onClick={() => setMenuIsOpen(true)}>
            <img src={avatar} alt="avatar" />
          </div>
        </div>
      ) : (
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
          <li className="avatar-link">
            <Link
              ref={activeElement}
              onClick={() => {
                setMenuIsOpen(false);
                closeMenu(false);
              }}
              to={unqiueName}>
              <div className="avatar">
                <img src={avatar} alt="avatar" />
              </div>
            </Link>
          </li>
          <hr className="line" />
          <li className="link">
            <Link
              onClick={() => {
                setMenuIsOpen(false);
                closeMenu(false);
              }}>
              Notification
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
            <Link
              onClick={() => {
                setMenuIsOpen(false);
                closeMenu(false);
              }}
              to={"settings"}>
              Setting
            </Link>
          </li>
          <li className="link">
            <Link
              onClick={() => {
                setMenuIsOpen(false);
                closeMenu(false);
              }}>
              Contact
            </Link>
          </li>
          <li className="link">
            <button
              className="logout-btn"
              onClick={() => {
                setMenuIsOpen(false);
                closeMenu(false);
                logout(searchLoggedInUser);
              }}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </>
  );
}
