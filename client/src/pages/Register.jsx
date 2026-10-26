import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/auth.css";

function Register({ setUser }) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await axios.post("/api/auth/register", {
                username,
                email,
                password
            });

            // Registering also logs the user in
            sessionStorage.setItem("user", JSON.stringify(response.data));
            setUser(response.data);

            navigate("/home");
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong.");
        }
    }

    return (
        <main className="auth-page">

            <div className="auth-card register-card">

                <div className="auth-icon">
                    📖
                </div>

                <h1>
                    Create Account
                </h1>

                <p className="auth-subtitle">
                    Join the ReleafBook community
                </p>


                {/* REGISTER FORM */}

                <form onSubmit={handleSubmit}>

                    {/* USERNAME */}

                    <div className="form-group">

                        <label htmlFor="register-username">
                            Username
                        </label>

                        <input
                            type="text"
                            id="register-username"
                            name="username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                    </div>

                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="register-email">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="register-email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="register-password"
                            name="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    {/* REGISTER BUTTON */}

                    <button type="submit" className="auth-btn">
                        Create Account
                    </button>

                    {/* MESSAGE */}

                    <p className="form-message form-error">
                        {message}
                    </p>

                </form>


                {/* LOGIN LINK */}

                <p className="switch-auth">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login here
                    </Link>

                </p>


                <p className="back-home">
                    <Link to="/">← Back to home page</Link>
                </p>

            </div>

        </main>
    );
}

export default Register;
