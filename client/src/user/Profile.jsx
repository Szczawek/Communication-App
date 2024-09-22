import ShowCase from "./ShowCase";
import Messages from "./mess/Messages";
export default function Profile({ user, loggedInUser, changeFriendsLis }) {
  return (
    <div className="profile">
      <ShowCase
        user={user}
        loggedInUser={loggedInUser}
        changeFriendsLis={changeFriendsLis}
      />
      <Messages ownerID={loggedInUser["id"]} recipientID={user["id"]} />
    </div>
  );
}
