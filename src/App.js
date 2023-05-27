import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Signup } from "./pages/signup";
import { LogIn } from "./pages/LogIn";
import { ForgetPassword } from "./pages/ForgetPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ProtectRoute } from "./components/ProtectRoute";
import { SavedDresses, SavedUrl } from "./pages/SavedUrl";

function App() {
  const base_url = process.env.REACT_APP_BASE_URI;
  const [logged, setlogged] = useState();
  const [saved, setsaved] = useState(0);
  const [cookie, setCookie] = useCookies(["refreshToken"]);
  const [dressCount, setdressCount] = useState(0);
  function handleLog() {
    setlogged(true);
    setsaved((prev) => prev + 0);
  }
  function handleLogout() {
    setlogged("");
  }
  function handleSaved() {
    setsaved((prev) => prev + 1);
  }

  useEffect(() => {
    cookie.refreshToken && cookie.refreshToken != "undefined"
      ? fetch(`${base_url}/url-user/savedCount`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: cookie.refreshToken,
        },
        body: JSON.stringify({
          // We should keep the fields consistent for managing this data later
          token: cookie.refreshToken,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setsaved(data.addedUrl);
        })
      : setsaved(0);
  }, [logged]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                log={logged}
                setlog={handleLog}
                setlogout={handleLogout}
                savedvalue={saved}
              />
            }>
            <Route
              index
              element={
                <ProtectRoute setlog={handleLog}>
                  <Home />
                </ProtectRoute>
              }
            />
            <Route
              path="log-in"
              element={<LogIn log={logged} setlog={handleLog} saved={saved} />}
            />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="sign-up" element={<Signup />} />
            <Route
              path="reset-password/:refreshToken"
              element={<ResetPassword />}
            />
            <Route
              path="/saved-url"
              element={
                <ProtectRoute setlog={handleLog}>
                  <SavedUrl />
                </ProtectRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
