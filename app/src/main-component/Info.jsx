import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Info() {
  const [values, setValues] = useState([]);
  const mess = useRef(null);
  const effect = useRef(false);
  const navigate = useNavigate()
  useEffect(() => {
    if (effect.current) return;
    function addVal() {
      setValues([1, 2, 3, 4, 5]);
    }
    addVal();
    return () => (effect.current = true);
  }, []);

  useEffect(() => {
    if (mess.current) mess.current.scrollTop = mess.current.scrollHeight;
  }, [values]);
  return (
    <div className="info">
      <div className="">
        <button
          onClick={() => navigate("/")}>
          X
        </button>
        <ul
          style={{
            height: "100px",
            backgroundColor: "red",
            overflow: "scroll",
          }}
          ref={mess}>
          {values.map((e, index) => {
            return <p key={index}>{e}</p>;
          })}
        </ul>
      </div>
      {/* <h1>
        The application was created for better communication between people.
        Sending and receiving messages in real time is the best example of our
        app's capabilities. In the future, the app will be updated to
        technological heights.
      </h1>
      <p>With greetings from Senderson Company</p> */}
    </div>
  );
}
