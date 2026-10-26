import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/auth.css";

function Login({ setUser }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await axios.post("/api/auth/login", { email, password });

            // Save the user (kept until the tab is closed)
            sessionStorage.setItem("user", JSON.stringify(response.data));
            setUser(response.data);

            navigate("/home");
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong.");
        }
    }

    return (
        <main className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    📚
                </div>

                <h1>
                    Welcome Back
                </h1>

                <p className="auth-subtitle">
                    Login to continue to ReleafBook
                </p>


                {/* LOGIN FORM */}

                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="login-email">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="login-email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="login-password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="login-password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    {/* LOGIN BUTTON */}

                    <button type="submit" className="auth-btn">
                        Login
                    </button>

                    {/* MESSAGE */}

                    <p className="form-message form-error">
                        {message}
                    </p>

                </form>


                {/* REGISTER LINK */}

                <p className="switch-auth">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create an account
                    </Link>

                </p>


                <p className="back-home">
                    <Link to="/">← Back to home page</Link>
                </p>

            </div>

        </main>
    );
}

export default Login;
