import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
export default function NavSettingsList({ user }) {
  const { unqiueName, avatar } = user;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const activeElement = useRef(null);
  const parentElement = useRef(null);

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
            <Link>1</Link>
          </li>
          <li className="link">
            <Link>2</Link>
          </li>
          <li className="link">
            <Link>3</Link>
          </li>
          <li className="link">
            <Link>4</Link>
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
