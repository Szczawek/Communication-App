import { Outlet, NavLink } from "react-router-dom";
import NavSettingsList from "../navigation/NavSettingsList";
import { useEffect, useRef, useState } from "react";

export default function Navigation({ user, notification }) {
  const [miniMenuIsActive, setMiniMenuIsActive] = useState(false);
  const menuElement = useRef(null);
  const firstElement = useRef(null);
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
              if (!e.relatedTarget) setMiniMenuIsActive(false);

              const state = e.target.contains(e.relatedTarget);
            }}
            className={`links-list ${!miniMenuIsActive ? "hide" : ""}`}>
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
            <li className="link">
              <NavSettingsList
                closeMenu={setMiniMenuIsActive}
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
