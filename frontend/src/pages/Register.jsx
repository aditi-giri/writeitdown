import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/axios";
import "../styles/auth.css";
import { isValidEmail } from "../utils/validators";

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        setMessage("");

        // ✅ 1. Mandatory fields validation
        if (!email || !password) {
            setMessage("All fields are mandatory");
            return;
        }

        // ✅ 2. Email format validation
        if (!isValidEmail(email)) {
            setMessage("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const res = await authApi.post("/auth/register", {
                email,
                password,
            });

            setMessage("Account created. Redirecting to login…");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            // ✅ Backend validation message
            setMessage(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Create your space</h2>
                <p className="auth-subtitle">
                    A private place for your thoughts and moods.
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
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>

                {message && (
                    <p
                        className={
                            message.includes("created")
                                ? "auth-success"
                                : "auth-error"
                        }
                    >
                        {message}
                    </p>
                )}

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};


export default Register;
