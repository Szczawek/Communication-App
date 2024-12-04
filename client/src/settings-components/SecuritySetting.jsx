import { useState } from "react";
import "../account/account.css";
import "../settings-components/settings.css";
import { Navigate } from "react-router-dom";
import { setConfirmCode } from "../account/setConfirmCode";
export default function SecuritySettings({ email }) {
  const [confirmCodeEnable, setConfirmCodeEnable] = useState(false);

  if (confirmCodeEnable) return <Navigate to={"/confirm-code"} />;
  async function activeTwoAuth() {  
    try {
      await setConfirmCode(email);
      setConfirmCodeEnable(true);
    } catch (err) {
      console.log(err)
    }
  }
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
        <button onClick={activeTwoAuth} className="enable-btn">
          Enable
        </button>
      </div>
    </div>
  );
}
