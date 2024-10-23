import Shelf from "../friends-menager/FriendsShelf";
import useFetchFriends from "../friends-menager/useFetchFriends";
import "../friends-menager/friendsList.css";

export default function Menager({personID}) {
  const [waitingList, waitingLoading] = useFetchFriends(personID,"accept");
  const [currentList, currentLoading] = useFetchFriends(personID,"current");
  const [invitedList, invitedLoading] = useFetchFriends(personID,"invite");
  return (
    <div className="menager">
      <div className="tables">
        {!waitingLoading ? <Shelf list={waitingList} /> : <p>Loading</p>}
        {!currentLoading ? <Shelf list={currentList} /> : <p>Loading</p>}
        {!invitedLoading ? <Shelf list={invitedList} /> : <p>Loading</p>}
      </div>
    </div>
  );
}
