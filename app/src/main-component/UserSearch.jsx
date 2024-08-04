import useUserSearch from "./useUserSearch";
import Profile from "../user/Profile";
import EditProfile from "../user/EditProfile";
import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import "../user/user.css";

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
      <Routes>
        <Route
          index
          element={
            <Profile
              user={user}
              loggedInUser={loggedInUser}
              changeFriendsLis={changeFriendsLis}
            />
          }
        />
        <Route path="edit-profile-info" element={<EditProfile />} />
      </Routes>
      <Outlet />
    </div>
  );
}
