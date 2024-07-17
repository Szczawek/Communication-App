import { useState } from "react";

export default function Test() {
  const [users, setUsers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
  return (
    <div className="test">
      {users.map((e, i) => {
        return (
          <p
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({ index: i})
              );
            }}
            onDragOver={(e) => {
              // Dodać setUsers(prev => {
              //  const copy = [...prev]
              // copy.splice(i,0,)
              // })
              //
              //
              // console.log(i,e.dataTransfer.getData("text/plain"))
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              //   console.log(i, e.dataTransfer.getData("text/plain"));
            }}
            onDrop={(e) => {
              const { index } = JSON.parse(
                e.dataTransfer.getData("text/plain")
              );
       
              setUsers((prev) => {
                const copy = [...prev];
                copy.splice(index, 1);
                copy.splice(i, 0, users[index]);
                console.log(copy);
                return copy;
              });

              console.log(i, JSON.parse(e.dataTransfer.getData("text/plain")));
            }}
            key={i}>
            {e}
          </p>
        );
      })}
    </div>
  );
}
