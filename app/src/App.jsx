import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, useEffect, useRef, Suspense, useState } from "react";
import "./styles.css";
const Account = lazy(() => import("./account/Account"));
const Navigation = lazy(() => import("./main-component/Navigation"));
const Home = lazy(() => import("./main-component/Home"));
const Info = lazy(() => import("./main-component/Info"));
const UserSearch = lazy(() => import("./main-component/UserSearch"));
const NotFound = lazy(() => import("./main-component/NotFound"));
const CreateAccount = lazy(() => import("./account/CreateAccount"));
const Login = lazy(() => import("./account/Login"));

export default function App() {
  const requestSend = useRef(false);
  const [refreshValue, setRefreshValue] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({
    nick: "User",
    avatar: "./images/user.jpg",
    unqiueName: "#9132",
    id: 0,
    friends: [],
  });

  useEffect(() => {
    if (requestSend.current) return;
    async function searchLoggedInUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/logged-in-user`, {
          credentials: "include",
        });
        if (res.status === 401) return;
        if (!res.ok) return console.error(`Error with server: ${res.status}`);
        const obj = await res.json();
        setLoggedInUser((prev) => {
          for (const key in obj) {
            if (!obj[key]) {
              obj[key] = prev[key];
            }
          }
          return obj;
        });
        console.log("start");
      } catch (err) {
        throw Error(
          `Error, the app now can't check if user is logged in: ${err}`
        );
      }
    }
    searchLoggedInUser();
    return () => (requestSend.current = true);
  }, [refreshValue]);

  function refreshUser() {
    setRefreshValue((prev) => !prev);
    requestSend.current = false;
  }
  return (
    <BrowserRouter>
      <Suspense fallback={<p className="full-screen loading">Loading...</p>}>
        <Routes>
          {loggedInUser["id"] === 0 ? (
            <Route path="/" element={<Account />}>
              <Route index element={<Login />} />
              <Route
                path="create-account"
                element={<CreateAccount refreshUser={refreshUser} />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          ) : (
            <Route path="/" element={<Navigation user={loggedInUser} />}>
              <Route index element={<Home id={loggedInUser["id"]} />} />
              <Route path="info" element={<Info refreshUser={refreshUser} />} />
              <Route
                path=":nick"
                element={<UserSearch loggedInUser={loggedInUser} />}
              />
            </Route>
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
