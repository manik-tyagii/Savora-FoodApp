import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOutCurrentUser } from "../features/authSlice";
import SavoraLogo from "../assets/savora-logo1.png";

import { ShoppingBagIcon, Menu, X, Sun, Moon } from "lucide-react";

function Navbar({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const cartCount = useSelector((state) => state.cart.items.length || 0);

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
                                lg:mr-[-2rem]
                                hover:bg-orange-600
                                transition
                            "
            >
              Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div
            className="
                            lg:hidden
                            pb-6
                            space-y-4
                            text-white
                        "
          >
            {/* Bag */}
            <div
              className="navbar-link flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBagIcon size={20} />
              <span>Bag ({cartCount})</span>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="theme-toggle flex items-center gap-2"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
              <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                                w-full
                                bg-orange-500
                                text-white
                                py-3
                                rounded-2xl
                                hover:bg-orange-600
                                transition
                            "
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
