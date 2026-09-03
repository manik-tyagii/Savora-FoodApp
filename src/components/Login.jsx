import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SavoraLogo from "../assets/savora-logo1.png";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("viewer@gmail.com");
  const [password, setPassword] = useState("tyagi@231");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError("Please fill all necessary details");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be of min. 6 length");
      return;
    }

    setFormError("");
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="login-page min-h-screen flex items-center justify-center px-4 sm:px-6 ">
      <div className="login-ambient" aria-hidden="true">
        <img className="login-food-art" src="/assets/food-tree.svg" alt="" />
        <img
          className="login-route-art"
          src="/assets/delivery-route.svg"
          alt=""
        />
        <span className="login-route-dot"></span>
      </div>
      <div className="w-full max-w-md p-6 sm:p-8 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700">
        <div className="flex justify-center mb-6">
          <img
            src={SavoraLogo}
            alt="Savora Logo"
            className="h-16 sm:h-20 w-auto object-contain"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
          Login for Savora
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-400"
            type="email"
            autoComplete="off"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-field">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-400"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {formError && <div className="text-red-400 text-sm">{formError}</div>}

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            className="w-full bg-orange-500 text-white py-3 rounded-2xl hover:bg-orange-600 transition disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-signup-prompt">
          New to Savora?
          <button type="button" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
