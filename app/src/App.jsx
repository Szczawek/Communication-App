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
const CreateAccount = lazy(() => import("./account/CreateAccount"));
const Login = lazy(() => import("./account/Login"));
const Settings = lazy(() => import("./main-component/Settings"));
const ReturnToPath = lazy(() => import("./main-component/ReturnToPath"));
const UserFunctions = createContext();

export default function App() {
  const [refreshValue, setRefreshValue] = useState(false);
  const effect = useRef(false);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState({
    nick: "User",
    avatar: "./images/user.jpg",
    unqiueName: "#9132",
    id: 0,
    friends: [],
  });

  useEffect(() => {
    if (effect.current) return;
    createSession();
    return () => (effect.current = true);
  }, [refreshValue]);

  async function createSession() {
    try {
      if (!localStorage.getItem("session")) {
        const res = await fetch(`${import.meta.env.VITE_URL}`, {
          credentials: "include",
        });
        const obj = await res.json();
        localStorage.setItem("session", obj["token"]);
      }
      await searchLoggedInUser();
    } catch (err) {
      console.error(err);
    }
  }

  async function searchLoggedInUser() {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/logged-in-user`, {
        credentials: "include",
        headers: {
          token: localStorage.getItem("session"),
        },
      });
      if (res.status === 204) {
        setLoggedInUser({ id: 0 });
        return;
      }
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
    } finally {
      setLoading(false);
    }
  }

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
        <UserFunctions.Provider value={{ refreshUser, searchLoggedInUser,loggedInUser }}>
          {loggedInUser["id"] === 0 && !loading ? (
            <Routes>
              <Route path="/account" element={<Account />}>
                <Route index element={<Login />} />
                <Route path="create" element={<CreateAccount />} />
                <Route path="*" element={<ReturnToPath path="/account" />} />
              </Route>
              <Route path="*" element={<ReturnToPath path="/account" />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Navigation user={loggedInUser} />}>
                <Route index element={<Home id={loggedInUser["id"]} />} />
                <Route path="info" element={<Info />} />
                <Route path="settings/*" element={<Settings />} />
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
              <Route path="*" element={<ReturnToPath path={"/info"} />} />
            </Routes>
          )}
        </UserFunctions.Provider>
      </Suspense>
    </BrowserRouter>
  );
}
export { UserFunctions };
