import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  lazy,
  useEffect,
  useRef,
  Suspense,
  useState,
  createContext,
} from "react";
import "./styles.css";
const Account = lazy(() => import("./account/Account"));
const Navigation = lazy(() => import("./main-component/Navigation"));
const Home = lazy(() => import("./main-component/Home"));
const Info = lazy(() => import("./main-component/Info"));
const UserSearch = lazy(() => import("./main-component/UserSearch"));
const NotFound = lazy(() => import("./main-component/NotFound"));
const CreateAccount = lazy(() => import("./account/CreateAccount"));
const Login = lazy(() => import("./account/Login"));
const UserFunctions = createContext();

export default function App() {
  const [refreshValue, setRefreshValue] = useState(false);
  const effect = useRef(false);
  const [loggedInUser, setLoggedInUser] = useState({
    nick: "User",
    avatar: "./images/user.jpg",
    unqiueName: "#9132",
    id: 0,
    friends: [],
  });

  useEffect(() => {
    if (effect.current) return;
    async function searchLoggedInUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/logged-in-user`, {
          credentials: "include",
        });
        if (res.status === 204) return setLoggedInUser({ id: 0 });
        if (!res.ok) return console.error(`Error with server: ${res.status}`);
        const obj = await res.json();

        setLoggedInUser((prev) => {
          for (const key in prev) {
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
    return () => (effect.current = true);
  }, [refreshValue]);

  function refreshUser() {
    effect.current = false;
    setRefreshValue((prev) => !prev);
  }

  function changeFriendsList(type, id) {
    switch (type) {
      case "add":
        setLoggedInUser((prev) => {
          const friends = [...prev["friends"]];
          friends.push(id);
          const obj = { ...prev, friends };
          return obj;
        });
        break;
      case "remove":
        setLoggedInUser((prev) => {
          const friends = [...prev["friends"]];
          const friendIndex = friends.findIndex((element) => element === id);
          friends.splice(friendIndex, 1);

          const obj = { ...prev, friends };
          return obj;
        });
        break;
    }
  }
  return (
    <BrowserRouter>
      <Suspense fallback={<p className="full-screen loading">Loading...</p>}>
        <UserFunctions.Provider value={refreshUser}>
          <Routes>
            {loggedInUser["id"] === 0 ? (
              <Route path="/" element={<Account />}>
                <Route index element={<Login refreshUser={refreshUser} />} />
                <Route
                  path="create-account"
                  element={<CreateAccount refreshUser={refreshUser} />}
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            ) : (
              <Route path="/" element={<Navigation user={loggedInUser} />}>
                <Route index element={<Home id={loggedInUser["id"]} />} />
                <Route path="info" element={<Info />} />
                <Route
                  path=":nick"
                  element={
                    <UserSearch
                      loggedInUser={loggedInUser}
                      changeFriendsLis={changeFriendsList}
                    />
                  }
                />
              </Route>
            )}
          </Routes>
        </UserFunctions.Provider>
      </Suspense>
    </BrowserRouter>
  );
}
export { UserFunctions };
