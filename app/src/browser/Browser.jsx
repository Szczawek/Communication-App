import Messages from "../user/Messages";
import UsersList from "./UsersList";
export default function Browser() {
  return (
    <div className="browser">
      <UsersList />
      <Messages />
    </div>
  );
}
