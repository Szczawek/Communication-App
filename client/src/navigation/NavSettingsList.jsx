import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "./logout";
import { UserFunctions } from "../App";
export default function NavSettingsList({
  closeMenu,
  user,
  notification,
  changeStateOfSubWin,
}) {
  const { unqiueName, avatar } = user;
  const [isListOpened, setIsListOpened] = useState(false);
  const activeElement = useRef(null);
  const parentElement = useRef(null);
  const { searchLoggedInUser } = useContext(UserFunctions);

  useEffect(() => {
    if (activeElement.current) {
      activeElement.current.focus();
    }
  }, [isListOpened]);

  function moveByOne(e) {
    console.log(e);
    switch (e.key) {
      case "ArrowUp":
        console.log("top");
        break;

      case "ArrowDown":
        console.log("bottom");
        break;
    }
  }

  function openList() {
    changeStateOfSubWin(true);
    setIsListOpened(true);
  }
  function closeList() {
    setIsListOpened(false);
    changeStateOfSubWin(false);
  }

  return (
    <>
      {!isListOpened ? (
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isListOpened) openList();
          }}
          tabIndex={0}
          className="avatar"
          onClick={openList}>
          <img src={avatar} alt="avatar" />
        </div>
      ) : (
        <ul
          onKeyDown={moveByOne}
          ref={parentElement}
          onBlur={(e) => {
            if (
              !e.relatedTarget ||
              !parentElement.current.contains(e.relatedTarget)
            )
              closeList();
          }}
          className="list">
          <li className="avatar-link">
            <Link
              className="box-link"
              ref={activeElement}
              onClick={closeList}
              to={unqiueName}>
              <div className="avatar">
                <img src={avatar} alt="avatar" />
              </div>
              <p className="desc-profile">Profile</p>
            </Link>
          </li>
          <hr className="line" />
          <li className="link">
            <Link to={"notifications"} onClick={closeList}>
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
                closeList();
                closeMenu(false);
              }}
              to={"settings"}>
              Setting
            </Link>
          </li>
          <li className="link">
            <Link
              to={"/settings/help-center"}
              onClick={() => {
                setIsListOpened(false);
                closeMenu(false);
              }}>
              Contact
            </Link>
          </li>
          <li className="link">
            <button
              className="logout-btn"
              onClick={() => {
                setIsListOpened(false);
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
