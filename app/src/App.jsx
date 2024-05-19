import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, useEffect, useRef, Suspense, useState } from "react";
import "./styles.css";
const Account = lazy(() => import("./account/Account"));
const Navigation = lazy(() => import("./main-component/Navigation"));
const Home = lazy(() => import("./main-component/Home"));
const UserSearch = lazy(() => import("./main-component/UserSearch"));

export default function App() {
  const requestSent = useRef(false);
  const [loggedInUser, setLoggedInUser] = useState({
    nick: "User",
    avatar: "./images/user.jpg",
    unqiueName: "#9132",
    id: 0,
    friends: [],
  });

  console.log(loggedInUser)

  useEffect(() => {
    if (requestSent.current) return;

    async function searchLoggedInUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/logged-in-user`, {
          credentials: "include",
        });
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
      } catch (err) {
        throw Error(
          `Error, the app now can't check if user is logged in: ${err}`
        );
      }
    }
    searchLoggedInUser();
    return () => (requestSent.current = true);
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<p className="full-screen loading">Loading...</p>}>
        <Routes>
          <Route path="/" element={<Navigation user={loggedInUser} />}>
            <Route path="/" element={<Home nick={loggedInUser["id"]} />} />
            <Route path="login/*" element={<Account />} />
            <Route
              path=":nick"
              element={<UserSearch loggedInUser={loggedInUser} />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
