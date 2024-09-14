import { Outlet, NavLink } from "react-router-dom";
import NavSettingsList from "../navigation/NavSettingsList";
import { useEffect, useRef, useState } from "react";
import "../navigation/navigation.css";

export default function Navigation({ user, notification }) {
  const [miniMenuIsActive, setMiniMenuIsActive] = useState(false);
  const [isSubWinOpened, setIsSubWinOpende] = useState(false);
  const menuElement = useRef(null);
  const firstElement = useRef(null);

  function changeStateOfSubWin(bool) {
    setIsSubWinOpende(bool);
  }

  function closeMenu() {
    setMiniMenuIsActive(false);
    setIsSubWinOpende(false);
  }

  useEffect(() => {
    if (firstElement.current) {
      firstElement.current.focus();
    }
  }, [miniMenuIsActive]);
  return (
    <>
      <header>
        <nav className="navigation">
          <button
            disabled={miniMenuIsActive ? true : false}
            onClick={() => setMiniMenuIsActive(true)}
            className="open-menu">
            <img src="./images/bars-solid.svg" alt="open menu btn" />
          </button>
          <ul
            tabIndex={0}
            ref={menuElement}
            onBlur={(e) => {
              // IT'S for mobile mode
              if (!e.relatedTarget) {
                setIsSubWinOpende(false);
                setMiniMenuIsActive(false);
              }
            }}
            className={`${isSubWinOpened ? "short" : ""} links-list ${
              !miniMenuIsActive ? "hide" : ""
            }`}>
            <li className="link">
              <NavLink
                onClick={() => setMiniMenuIsActive(false)}
                ref={firstElement}
                className={({ isActive }) => (isActive ? "active" : "")}
                to="/">
                Home
              </NavLink>
            </li>
            <li className="link">
              <NavLink
                onClick={() => setMiniMenuIsActive(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
                to="info">
                Info
              </NavLink>
            </li>
            <li className="link">
              <NavLink
                onClick={() => setMiniMenuIsActive(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
                to="menage-friends">
                Friends
              </NavLink>
            </li>
            <li className="link open-list">
              <NavSettingsList
                changeStateOfSubWin={changeStateOfSubWin}
                closeMenu={closeMenu}
                user={user}
                notification={notification}
              />
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
