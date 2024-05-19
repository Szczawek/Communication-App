import { useState } from "react";
import useFetchFriends from "./useFetchFriends";

export default function UsersList() {
  const users = useFetchFriends();

  if (!users[0]) return <p className="empty">empty table</p>;
  return (
    <div className="users_list">
      <ul className="list">
        {users.map((e) => {
          return (
            <li key={e["date"]}>
              <p>{e["nick"]}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
