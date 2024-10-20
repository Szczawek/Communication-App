import ConfirmCode from "../account/ConfirmCode";
import "../account/account.css";
import "../settings-components/settings.css";
export default function SecuritySettings() {
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
        <ConfirmCode />
      </div>
    </div>
  );
}
