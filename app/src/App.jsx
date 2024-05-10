import UsersList from "./user/UsersList";
import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Account from "./account/Account";
import Navigation from "./main-component/Navigation";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route path="/" element={<UsersList />} />
          <Route path="login/*" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
