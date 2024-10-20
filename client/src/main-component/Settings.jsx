import { Link } from "react-router-dom";
import "../settings-components/settings.css";
import Layout from "../settings-components/Layout";
import { useState } from "react";

export default function Settings() {
  const [mobileMode, setMobileMode] = useState(true);

  function showArrow() {
    setMobileMode(false);
  }

  return (
    <div className="setting">
      <ul className={`settings-list ${!mobileMode ? "hide-in-mobile" : ""}`}>
        <li onClick={showArrow} className="link">
          <Link to="">Account</Link>
        </li>
        <li onClick={showArrow} className="link">
          <Link to="security-settings">Security</Link>
        </li>
        <li onClick={showArrow} className="link">
          <Link to="notification-settings">Notification</Link>
        </li>
        <li onClick={showArrow} className="link">
          <Link to="help-center">Help Center</Link>
        </li>
      </ul>

      <button
        className={`return-btn ${
          !mobileMode ? "show-in-mobile" : "hide-in-mobile"
        }`}
        onClick={() => setMobileMode(true)}>
        <img src="/images/arrow-left.svg" alt="come back to settings list" />
      </button>
      <Layout mobileMode={mobileMode} />
    </div>
  );
}
