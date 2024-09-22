    import { Link, Outlet, Route, Routes } from "react-router-dom";
    import AccountSettings from "../settings-components/AccountSettings";
    import SecuritySettings from "../settings-components/SecuritySetting";
    import HelpCenter from "../settings-components/HelpCenter";
    import NotificationSettings from "../settings-components/NotificationSettings";
    import "../settings-components/settings.css";

    export default function Settings() {
    return (
        <div className="setting">
        <ul className="main-settings">
            <li className="link">
            <Link to="  ">Account</Link>
            </li>
            <li className="link">
            <Link to="security-settings">Security</Link>
            </li>
            <li className="link">
            <Link to="notification-settings">Notification</Link>
            </li>
            <li className="link">
            <Link to="help-center">Help Center</Link>
            </li>
        </ul>
        <Routes>
            <Route path="/">
            <Route index element={<AccountSettings />} />
            <Route path="security-settings" element={<SecuritySettings />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route
                path="notification-settings"
                element={<NotificationSettings />}
            />
            </Route>
        </Routes>
        <Outlet />
        </div>
    );
    }
