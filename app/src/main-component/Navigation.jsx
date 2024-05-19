import { Outlet, NavLink } from "react-router-dom";
import NavSettingsList from "../navigation/NavSettingsList";
import { useState } from "react";

export default function Navigation({ user }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <>
      <header>
        <nav className="navigation">
          <ul className="links-list">
            <li className="link">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to="/">
                Home
              </NavLink>
            </li>
            <li className="link">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to="login">
                Login
              </NavLink>
            </li>
            <li className="link">
              <NavSettingsList user={user} />
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
