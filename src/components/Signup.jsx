import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/authSlice";
import { useEffect, useState } from "react";
import { SWIGGY_LOGO } from "../utils/constant";
import { useNavigate } from "react-router-dom";

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector(state => state.auth);

    const [email, setEmail] = useState("");
    const [password, SetPassword] = useState("");
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
        dispatch(signupUser({ email, password }));
    };

    useEffect(() => {
        if (user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-slate-100">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-3xl">

                <div className="flex justify-center mb-6">
                    <img
                        className="h-16 sm:h-20 w-auto rounded-3xl"
                        src={SWIGGY_LOGO}
                        alt="Logo"
                    />
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
                    Signup for Swiggy
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => SetPassword(e.target.value)}
                    />

                    {formError && (
                        <div className="text-red-500 text-sm">{formError}</div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <button
                        className="w-full bg-orange-500 text-white py-3 rounded-2xl hover:bg-orange-600 transition disabled:opacity-60"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
