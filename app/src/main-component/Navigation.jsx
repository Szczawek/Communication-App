import { Outlet, NavLink } from "react-router-dom";
export default function Navigation() {
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
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
