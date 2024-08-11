  import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Test from "./Test";

export default function Info() {
  return (
    <div className="info">
      <Test></Test>
      <h1>
        The application was created for better communication between people.
        Sending and receiving messages in real time is the best example of our
        app's capabilities. In the future, the app will be updated to
        technological heights.
      </h1>
      <p>With greetings from Senderson Company</p>
    </div>
  );
}
