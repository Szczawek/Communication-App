import { Outlet, NavLink } from "react-router-dom";
import NavSettingsList from "../navigation/NavSettingsList";

export default function Navigation({ user }) {
  const { id } = user;
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
              {id != 0 ? (
                <NavSettingsList user={user} />
              ) : (
                <NavLink
                  to={"/login"}
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  Login
                </NavLink>
              )}
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
