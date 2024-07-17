
import { Outlet, NavLink } from "react-router-dom";
import NavSettingsList from "../navigation/NavSettingsList";

export default function Navigation({ user }) {
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
                to="info">
                Info
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
