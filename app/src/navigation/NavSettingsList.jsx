import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./logout";
import { UserFunctions } from "../App";
export default function NavSettingsList({ user }) {
  const { unqiueName, avatar } = user;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const activeElement = useRef(null);
  const parentElement = useRef(null);
  const navigate = useNavigate()
  const refreshUser = useContext(UserFunctions);
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
      className="option">
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
          <li className="link main_option">
            <Link
              className="fn"
              ref={activeElement}
              onClick={() => {
                setMenuIsOpen(false);
              }}
              to={unqiueName}>
              <div className="avatar">
                <img
                  src={!avatar ? "./images/user.jpg" : avatar}
                  alt="avatar"
                />
              </div>
            </Link>
          </li>
          <hr className="line" />
          <li className="link">
            <Link className="fn">1</Link>
          </li>
          <li className="link">
            <Link className="fn">2</Link>
          </li>
          <li className="link">
            <Link className="fn">3</Link>
          </li>
          <li className="link">
            <button className="fn" onClick={() => logout(refreshUser,navigate)}>
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
