import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  lazy,
  useEffect,
  useRef,
  Suspense,
  useState,
  createContext,
  useMemo,
} from "react";
import "./styles.css";
import useWebSocketTunel from "./main-component/useWebSocketTunel";
const Account = lazy(() => import("./account/Account"));
const Navigation = lazy(() => import("./main-component/Navigation"));
const Home = lazy(() => import("./main-component/Home"));
const Info = lazy(() => import("./main-component/Info"));
const UserSearch = lazy(() => import("./main-component/UserSearch"));
const CreateAccount = lazy(() => import("./account/CreateAccount"));
const Login = lazy(() => import("./account/Login"));
const Settings = lazy(() => import("./main-component/Settings"));
const ReturnToPath = lazy(() => import("./main-component/ReturnToPath"));
const MenageFriends = lazy(() => import("./main-component/MenageFriedns"));
import ErrorComponent from "./main-component/ErrorComponent";
const UserFunctions = createContext();

const stdData = {
  nick: "User",
  avatar: "/images/user.jpg",
  banner: "/images/banner.jpg",
  unqiueName: "#9132",
  id: 0,
  friends: [],
};
export default function App() {
  const [refreshValue, setRefreshValue] = useState(false);
  const [notification, setNotification] = useState(0);
  const effect = useRef(false);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(stdData);
  const [serverError, setServerError] = useState(false);
  const wss = useWebSocketTunel(loggedInUser["id"], menageNotificaion);

  useEffect(() => {
    if (effect.current) return;
    createSession();
    return () => (effect.current = true);
  }, [refreshValue]);

  async function createSession() {
    try {
      if (!sessionStorage.getItem("session")) {
        const res = await fetch(`${process.env.VITE_URL}`, {
          credentials: "include",
        });
        const obj = await res.json();
        sessionStorage.setItem("session", obj["token"]);
      }
      await searchLoggedInUser();
    } catch (err) {
      setLoggedInUser(stdData);
      setLoading(false);
      setServerError(true);
      console.error(err);
    }
  }
  async function searchLoggedInUser() {
    try {
      const res = await fetch(`${process.env.VITE_URL}/logged-in-user`, {
        credentials: "include",
        headers: {
          token: sessionStorage.getItem("session"),
        },
      });
      if (res.status === 204) {
        setLoggedInUser(stdData);
        return;
      }
      const obj = await res.json();
      if (!res.ok) {
        setServerError(true);
        return console.error(`${obj}: ${res.status}`);
      }
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

  function menageNotificaion(action, value) {
    switch (action) {
      case "add":
        setNotification((prev) => prev + value);
        break;
      case "remove":
        setNotification((prev) => prev - value);
    }
  }

  function editProfileImages(avatar, banner) {
    const test = { ...loggedInUser, avatar, banner };
    console.log(test);
    console.log(...args);
    // setLoggedInUser(prev => ({...prev}))
  }

  if (loading) return <p className="loading-app">Loading ...</p>;

  if (serverError) return <ErrorComponent />;
  return (
    <BrowserRouter>
      <Suspense fallback={<p className="full-screen loading">Loading ...</p>}>
        <UserFunctions.Provider
          value={{
            notification,
            refreshUser,
            searchLoggedInUser,
            loggedInUser,
            changeFriendsList,
            menageNotificaion,
            editProfileImages,
          }}>
          {loggedInUser["id"] === 0 ? (
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
              <Route
                path="/"
                element={
                  <Navigation user={loggedInUser} notification={notification} />
                }>
                <Route index element={<Home id={loggedInUser["id"]} />} />
                <Route path="info" element={<Info />} />
                <Route
                  path="menage-friends"
                  element={
                    <MenageFriends
                      changeFriendsLis={changeFriendsList}
                      id={loggedInUser["id"]}
                    />
                  }
                />
                <Route path="settings/*" element={<Settings />} />
                <Route
                  path=":nick/*"
                  element={
                    <UserSearch
                      loggedInUser={loggedInUser}
                      changeFriendsLis={changeFriendsList}
                    />
                  }></Route>
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
