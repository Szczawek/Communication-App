import { useState } from "react";
import ConfirmCode from "../account/ConfirmCode";
import "../account/account.css";
import "../settings-components/settings.css";
import { Navigate } from "react-router-dom";
export default function SecuritySettings() {
  const [confirmCodeEnable, setConfirmCodeEnable] = useState(false);

  if (confirmCodeEnable) return <Navigate to={"/confirm-code"} />;
  
  return (
    <div className="security-settings">
      <header className="title hq">
        <h2>Security</h2>
      </header>
      <div className="two-steps-auth">
        <header className="sub-title hq">
          <h3>Two Steps Auth</h3>
          <p>it's recommended</p>
        </header>
        <button
          onClick={() => setConfirmCodeEnable(true)}
          className="enable-btn">
          Enable
        </button>
      </div>
    </div>
  );
}
