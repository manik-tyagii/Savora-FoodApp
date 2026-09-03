import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOutCurrentUser } from "../features/authSlice";
import { storage } from "../utils/storage";
import SavoraLogo from "../assets/savora-logo1.png";

import {
  ShoppingBagIcon,
  Menu,
  X,
  Sun,
  Moon,
  UserRound,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";

function Navbar({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  const cartCount = useSelector((state) => state.cart.items.length || 0);
  const user = useSelector((state) => state.auth.user);
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Food lover";

  useEffect(() => {
    if (!open) return;

    fetch("/mock/restaurants.json")
      .then((response) => response.json())
      .then((data) => setRestaurants(Array.isArray(data) ? data : []))
      .catch(() => setRestaurants([]));
  }, [open]);

  const favoriteRestaurants = restaurants
    .filter(
      (restaurant) =>
        storage.get(`savora-favorite-${restaurant?.info?.id}`) === "true",
    )
    .slice(0, 6);

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    await dispatch(signOutCurrentUser());
    navigate("/login");
  };

  return (
    <nav
      className="
                w-full
                navbar-shell
                navbar-shadow
            "
    >
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:pl-8 lg:pr-0">
        {/* Main Navbar */}
        <div className="flex items-center justify-between py-1.5 sm:py-2">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer group"
          >
            <img
              src={SavoraLogo}
              alt="Savora Logo"
              className="h-9 sm:h-10 w-auto rounded-lg"
            />

            <div className="ml-2 sm:ml-3 flex flex-col leading-tight">
              <span
                className="
                                    text-[9px]
                                    sm:text-[10px]
                                    md:text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.3em]
                                    text-white
                                "
              >
                The Taste you need
              </span>

              <span
                className="
                                    mt-0.5
                                    h-px
                                    w-5
                                    sm:w-6
                                    bg-white
                                "
              ></span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:ml-auto lg:flex items-center space-x-5 text-sm text-white">
            {/* Cart */}
            <div
              className="navbar-link flex items-center cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <div className="relative">
                <ShoppingBagIcon size={16} />

                <span
                  className="
                                        absolute
                                        -top-2
                                        -right-2
                                        bg-orange-500
                                        text-white
                                        rounded-full
                                        w-5
                                        h-5
                                        flex
                                        items-center
                                        justify-center
                                        text-xs
                                        font-bold
                                    "
                >
                  {cartCount}
                </span>
              </div>

              <span className="ml-2">Bag</span>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                                bg-orange-500
                                text-white
                                px-3
                                py-1
                                text-sm
                                rounded-2xl
                                hover:bg-orange-600
                                transition
                            "
            >
              Logout
            </button>

            <button
              type="button"
              className="navbar-menu-trigger lg:-ml-12 lg:translate-x-10"
              onClick={() => setOpen(true)}
              aria-label="Open profile and favorites menu"
              title="Profile and favorites"
            >
              <Menu size={17} />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white"
            onClick={() => setOpen(true)}
            aria-label="Open profile and favorites menu"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Profile and favorites drawer */}
        {open && (
          <div className="nav-drawer-layer" role="dialog" aria-modal="true">
            <button
              type="button"
              className="nav-drawer-backdrop"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            />
            <aside className="nav-drawer">
              <div className="nav-drawer-heading">
                <div>
                  <p className="nav-drawer-kicker">Your Savora</p>
                  <h2>Profile & favourites</h2>
                </div>
                <button
                  type="button"
                  className="nav-drawer-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close profile and favorites menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="nav-profile-card">
                <span className="nav-profile-avatar">
                  <UserRound size={21} />
                </span>
                <div>
                  <strong>{displayName}</strong>
                  <span>{user?.email || "Food lover"}</span>
                </div>
              </div>

              <div className="nav-delivery-row">
                <MapPin size={17} />
                <span>
                  <small>Delivery address</small>
                  Bengaluru
                </span>
              </div>

              <div className="nav-drawer-section">
                <div className="nav-drawer-section-title">
                  <span>
                    <Heart size={16} /> Favourite restaurants
                  </span>
                  <small>{favoriteRestaurants.length}</small>
                </div>
                {favoriteRestaurants.length ? (
                  favoriteRestaurants.map((restaurant) => {
                    const restaurantId = restaurant?.info?.id;
                    const restaurantName =
                      restaurant?.info?.name || "Restaurant";
                    return (
                      <button
                        type="button"
                        className="nav-favorite-item"
                        key={restaurantId}
                        onClick={() => goTo(`/restaurant/${restaurantId}`)}
                      >
                        <Heart size={16} fill="currentColor" />
                        <span>{restaurantName}</span>
                        <ChevronRight size={16} />
                      </button>
                    );
                  })
                ) : (
                  <p className="nav-empty-favorites">
                    Tap the heart on a restaurant to save it here.
                  </p>
                )}
              </div>

              <div className="nav-drawer-actions">
                <button type="button" onClick={() => goTo("/cart")}>
                  <ShoppingBagIcon size={18} /> My bag ({cartCount})
                </button>
                <button type="button" onClick={onToggleTheme}>
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                  {theme === "light" ? "Dark mode" : "Light mode"}
                </button>
                <button
                  type="button"
                  className="nav-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
