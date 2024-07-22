import { useCallback, useEffect, useRef, useState } from "react";
import useInfinityScroll from "./useInfinityScroll";
import InviteFromFriends from "../menage-friends/InviteFromFriends";
import "./menageFriends.css";
export default function MenageFriends({ changeFriendsList, id }) {
  const botomOpponent = useRef(null);
  const { value, allMessLoaded, setIsElementSet } = useInfinityScroll(
    `users/${id}`,
    botomOpponent.current
  );
  const setRef = useCallback((element) => {
    if (element) {
      setIsElementSet(true);
      botomOpponent.current = element;
      console.log("calback");
    }
  }, []);

  return (
    <div className="menage-firends">
      <InviteFromFriends id={id} />
      <ul className="friends-list">
        {value.map((e) => {
          return (
            <div key={e["id"]} className="friend-container">
              <div className="avatar">
                <img src={e["avatar"]} alt="avatar" />
              </div>
              <div className="friend-info">
                <div className="">
                  <p className="name">{e["name"]}</p>
                  <p className="unqiue-name">{e["unqiue_name"]}</p>
                </div>
                <button
                  className="remove-friend"
                  onClick={() => changeFriendsList("remove", e["id"])}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
        {!value[0] && !allMessLoaded ? <p>Loading...</p> : null}
        {!value[0] && <p>There are no friends on your list...</p>}
        {!allMessLoaded && <p ref={setRef}>Look Here!</p>}
      </ul>
    </div>
  );
}
