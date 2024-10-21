import { useEffect, useState } from "react";
import { changeFriendStatus } from "./changeFriendStatus";
import { Link } from "react-router-dom";
import MenageProfile from "./MenageProfile";
export default function ShowCase({ user, loggedInUser, changeFriendsLis }) {
  const { nick, avatar, unqiueName, id, banner } = user;
  const [friendAccount, setFriendAccount] = useState(false);
  const [slowDown, setSlowDown] = useState(false);
  useEffect(() => {
    if (loggedInUser["id"] === id) return;
    // setFriendAccount(loggedInUser["friends"].includes(id));
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
          <p className="unqiue-name">@{unqiueName}</p>
        </div>
        {loggedInUser["id"] === id ? (
          <Link to={"edit-profile-info"}>Edit</Link>
        ) : !friendAccount ? (
          <MenageProfile from={loggedInUser.id} to={id} />
        ) : (
          NULL
        )}
      </div>
    </div>
  );
}
