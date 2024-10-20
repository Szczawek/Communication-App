  import { useCallback, useRef } from "react";
  import useInfinityScroll from "./useInfinityScroll";
  import InviteFromFriends from "../friends-menager/InviteFromFriends";
  import ProfileLink from "./ProfileLink";
  import "../friends-menager/friends-menager.css";

  export default function MenageFriends({ changeFriendsList, id }) {
    const botomOpponent = useRef(null);
    const { value, allValueLoaded, setIsElementSet, setValue } =
      useInfinityScroll(`users/${id}`, botomOpponent.current);
    const setRef = useCallback((element) => {
      if (element) {
        setIsElementSet(true);
        botomOpponent.current = element;
      }
    }, []);

    return (
      <div className="menage-friends">
        <InviteFromFriends id={id} />
        <ul className="friends-list">
          {value.map((e, i) => {
            return (
              <div key={e["date"]} className="remove-friend-container">
                <ProfileLink data={e} setArray={setValue} index={i} />
                <button
                  className="remove-friend"
                  onClick={() => changeFriendsList("remove", e["id"])}>
                  Remove
                </button>
              </div>
            );
          })}

          {!value[0] && allValueLoaded ? (
            <p>Empty friends list</p>
          ) : null}
          {!allValueLoaded && <p className="loading-fr" ref={setRef}>Loading ...</p>}
        </ul>
      </div>
    );
  }
