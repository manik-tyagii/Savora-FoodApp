import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Chatbot from "./components/Chatbot";

function App() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("savora-theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("savora-theme", theme);
  }, [theme]);

  const hideLayoutRoutes = ["/login", "/signup"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      {user && !shouldHideLayout && (
        <Navbar
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => (current === "light" ? "dark" : "light"))
          }
        />
      )}

      {/* Main Content */}
      <div className="flex-1 savora-main">
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/home" />}
          />

          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/home" />}
          />

          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/login" />}
          />

          <Route
            path="/restaurant/:id"
            element={user ? <RestaurantDetail /> : <Navigate to="/login" />}
          />

          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" />}
          />

          <Route
            path="/checkout"
            element={user ? <Checkout /> : <Navigate to="/login" />}
          />

          <Route
            path="/"
            element={<Navigate to={user ? "/home" : "/login"} />}
          />
        </Routes>
      </div>

      {/* Footer */}
      {user && !shouldHideLayout && <Footer />}
      {user && !shouldHideLayout && <Chatbot />}
    </div>
  );
}

export default App;
