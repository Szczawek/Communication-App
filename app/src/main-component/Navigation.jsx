import { Outlet, NavLink } from "react-router-dom";
export default function Navigation({ user }) {
  const { nick, id, unqiueName } = user;

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
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to={id != 0 ? `/${unqiueName}` : "/login"}>
                {id != 0 ? `${nick}` : "/login"}
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
