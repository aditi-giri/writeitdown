import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import { isValidEmail } from "../utils/validators";
import "../styles/auth.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        // ✅ 1. Mandatory fields
        if (!email || !password) {
            setError("All fields are mandatory");
            return;
        }

        // ✅ 2. Email format
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const res = await authApi.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("email", res.data.email);

            login({ email: res.data.email });
            navigate("/dashboard");

        } catch (err) {
            // ✅ Backend-driven error
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">
                    Your journal is private. Only you can access it.
                </p>

                <input
                    className="auth-input"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    className="auth-button"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                {error && <p className="auth-error">{error}</p>}

                <div className="auth-footer">
                    New here? <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
