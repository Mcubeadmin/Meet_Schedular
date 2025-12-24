import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        passwordCopy: ""
    });

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleRegister(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        
        const { name, email, password, passwordCopy } = form;
        if (!name || !email || !password || !passwordCopy) {
            toast.error("All fields required");
            setLoading(false);
            return;
        }

        if ( password != passwordCopy ) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;    
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.msg || "Registration failed");
                setLoading(false);
                return;
            }

            toast.success("Check your email to verify account!");
            navigate("/login");

            setLoading(false)
        } catch (err) {
            console.error("Registeration failed", err.message);
            setLoading(false)
            toast.error("Coudn't connect to server. Please check your internet connection or try again later!")
            return;
        }
    }

    return (
        <>
        <div className="register-container">
            <h1>New User Registeration</h1>
            <form className="register-form">
                <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                
                <input 
                    name="password"
                    type="password"
                    placeholder="Enter New Password"
                    value={form.password}
                    onChange={handleChange}
                />
                <input 
                    name="passwordCopy"
                    type="password"
                    placeholder="Confirm Password"
                    value={form.passwordCopy}
                    onChange={handleChange}
                />
                
                <div className="registerBtn">
                    <button onClick={handleRegister} disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
}