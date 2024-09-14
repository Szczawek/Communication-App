import { useState } from "react";
import "./notification.css"

export default function Notification() {
  const [nots, setNots] = useState([]);

  return (
    <div className="notification">
      <ul className="notification-list">
        {!nots[0] ? <p className="statement">Zero new notifications</p>:null }
        {nots.map((e) => {
          return <li key={e["id"]}>{e["content"]}</li>;
        })}
      </ul>
    </div>
  );
}
