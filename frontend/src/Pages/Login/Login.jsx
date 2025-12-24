import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css"

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    //{import.meta.env.VITE_API_URL}

    async function handleLogin(e) {
        e.preventDefault();

        try {
            console.log(`${import.meta.env.VITE_API_URL}`)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.msg || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            window.dispatchEvent(new Event("authChange"));

            setMsg("Login Successful!");
            navigate("/", {state: {message: 'Login Successful!'} });
        } catch (err) {
            console.error(err);
            setMsg("Server error");
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <div className="loginBtn">
                <button type="submit">Login</button>
                </div>
                {msg && <p>{msg}</p>}
                <Link className="register-link" to="/register">New user? Please register</Link>
            </form>
        </div>
    );
}