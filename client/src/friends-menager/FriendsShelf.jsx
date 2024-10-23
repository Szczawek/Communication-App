import { useState } from "react";

export default function Shelf({ personID, type, list }) {
  return (
    <ul className="shelf">
      {list.map((e) => {
        return (
          <div key={e.date} className="person-from-list">
            <div className="avatar">
              <img src={e.avatar} alt="avatar" />
            </div>
            <header className="desc">
              <h2>{e.name}</h2>
              <h3>{e.unqiueName}</h3>
            </header>
          </div>
        );
      })}
      {!list[0] ? <p>Empty list</p> : null}
    </ul>
  );
}
