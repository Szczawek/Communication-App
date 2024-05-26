import useUserSearch from "./useUserSearch";
import Profile from "../user/Profile";
import "../user/user.css";
export default function UserSearch({ loggedInUser }) {
  const user = useUserSearch();

  if (!user) return <div className="not_found">User not found...</div>;
  return (
    <div className="user">
      <Profile user={user} loggedInUser={loggedInUser} />
    </div>
  );
}
