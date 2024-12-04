    import { lazy } from "react";
    import { Outlet, Route, Routes } from "react-router-dom";
    import AccountSettings from "./AccountSettings";
    const HelpCenter = lazy(() => import("./HelpCenter"));
    const SecuritySettings = lazy(() => import("./SecuritySetting"));
    const NotificationSettings = lazy(() => import("./NotificationSettings"));

    export default function Layout({ mobileMode,email }) {
    return (
        <div className={`${mobileMode ? "components" : ""} `}>
        <Routes>
            <Route path="/">
            <Route index element={<AccountSettings />} />
            <Route path="security-settings" element={<SecuritySettings email={email} />} />
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
