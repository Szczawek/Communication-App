import { useEffect, useState } from "react";
import { changeFriendStatus } from "./changeFriendStatus";
import { Link } from "react-router-dom";
export default function ShowCase({ user, loggedInUser, changeFriendsLis }) {
  const { nick, avatar, unqiueName, id, banner } = user;
  const [friendAccount, setFriendAccount] = useState(false);
  const [slowDown, setSlowDown] = useState(false);
  useEffect(() => {
    if (loggedInUser["id"] === id) return;
    setFriendAccount(loggedInUser["friends"].includes(id));
  }, [user, loggedInUser]);
  return (
    <div className="show-case">
      <div className="baner">
        <img loading="lazy" src={banner} alt="banner" />
        <div className="circle">
          <div className="avatar">
            <img
              loading="lazy"
              className="profile_img"
              src={avatar}
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
        {loggedInUser["id"] === id ? (
          <Link to={"edit-profile-info"}>Edit</Link>
        ) : (
          <button
            className="friend"
            disabled={slowDown ? true : false}
            onClick={async () => {
              try {
                const res = await fetch(
                  `${process.env.VITE_URL}/${
                    friendAccount ? "friends-list-change" : "send-invite"
                  }`,
                  {
                    method: "POST",
                    headers: {
                      "Content-type": "application/json",
                      token: sessionStorage.getItem("session"),
                    },
                    credentials: "include",
                    body: JSON.stringify({
                      action: friendAccount ? "remove" : null,
                      personID: loggedInUser["id"],
                      friendID: id,
                    }),
                  }
                );
                if (!res.ok) throw res.status;

                setSlowDown(true);
                setTimeout(() => {
                  setSlowDown(false);
                }, 1500);
                // to edit
                // to edit
                if (friendAccount) {
                  setFriendAccount(false);
                  changeFriendStatus(
                    "remove",
                    loggedInUser["id"],
                    id,
                    changeFriendsLis
                  );
                }
                // to edit
              } catch (err) {
                throw Error(
                  `Error with add/remove firend with firends list: ${err}`
                );
              }
            }}>
            {friendAccount ? "Remove" : "Add"}
          </button>
        )}
      </div>
    </div>
  );
}
