import useUserSearch from "./useUserSearch";
import Profile from "../user/Profile";
import Messages from "../mess/Messages";

import "../user/user.css";
import { useState } from "react";
export default function UserSearch({ loggedInUser, changeFriendsLis }) {
  const [loading, setLoading] = useState(true);
  const user = useUserSearch(stopLoadingScreen);

  function stopLoadingScreen() {
    setLoading(false);
  }
  
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="not_found">User not found...</div>;
  return (
    <div className="user">
      <Profile
        user={user}
        loggedInUser={loggedInUser}
        changeFriendsLis={changeFriendsLis}
      />
      <Messages ownerID={loggedInUser["id"]} recipientID={user["id"]} />
    </div>
  );
}
