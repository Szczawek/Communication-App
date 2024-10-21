import { Link } from "react-router-dom";
import "./profileLink.css";

export default function ProfileLink({ data, setArray, index }) {
  const { nick, unqiueName, avatar } = data;
  return (
    <li
      // draggable
      // onDragStart={(e) => {
      //   e.dataTransfer.setData(
      //     "text/plain",
      //     JSON.stringify({ indexOfArray: index })
      //   );
      // }}
      // onDragOver={(e) => {
      //   e.preventDefault();
      //   e.dataTransfer.dropEffect = "move";
      // }}
      // onDrop={(e) => {
      //   const { indexOfArray } = JSON.parse(
      //     e.dataTransfer.getData("text/plain")
      //   );
      //   setArray((prev) => {
      //     const copy = [...prev];
      //     const copyObj = copy[indexOfArray];
      //     copy.splice(indexOfArray, 1);
      //     copy.splice(index, 0, copyObj);
      //     return copy;
      //   });
      // }}
      className="profile-link-container">
      <Link className="profile-link" to={`/${unqiueName}`}>
        <div className="avatar">
          <img src={avatar} alt="avatar" />
        </div>
        <div className="info">
          <p className="nick">{nick}</p>
          <p className="unqiue_name">{unqiueName}</p>
        </div>
      </Link>
    </li>
  );
}
