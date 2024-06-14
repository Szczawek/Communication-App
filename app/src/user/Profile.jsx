import { useEffect, useState } from "react";
import { changeFriendStatus } from "./changeFriendStatus";
export default function Profile({ user, loggedInUser, changeFriendsLis }) {
  const { nick, avatar, unqiueName, id, baner } = user;
  const [friendAccount, setFriendAccount] = useState(false);
  const [slowDown, setSlowDown] = useState(false);

  useEffect(() => {
    if (loggedInUser["id"] === id) return;
    setFriendAccount(loggedInUser["friends"].includes(id));
  }, []);

  return (
    <div className="profile">
      <div className="baner">
        <img src={!baner ? "./images/baner.jpg" : baner} alt="baner" />
        <div className="circle">
          <div className="avatar">
            <img
              className="profile_img"
              src={!avatar ? "./images/user.jpg" : avatar}
              alt="avatar"
            />
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="profile_info">
          <p className="nick">{nick}</p>
          <p className="unqiue-name">{unqiueName}</p>
        </div>
        {loggedInUser["id"] === id ? null : (
          <button className="friend"
            disabled={slowDown ? true : false}
            onClick={() => {
              setSlowDown(true);
              setTimeout(() => {
                setSlowDown(false);
              }, 1000);
              changeFriendStatus(
                friendAccount ? "remove" : "add",
                loggedInUser["id"],
                id,
                changeFriendsLis
              );
              setFriendAccount((prev) => !prev);
            }}>
            {friendAccount ? "Remove" : "Add"}
          </button>
        )}
      </div>
    </div>
  );
}
