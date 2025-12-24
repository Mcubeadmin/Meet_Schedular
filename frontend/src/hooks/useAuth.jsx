import { useState, useEffect } from "react";

export default function useAuth() {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    useEffect(() => {
        function updateAuth(){
            setToken(localStorage.getItem("token"));
        }

        window.addEventListener("authChange", updateAuth);
        return () => window.removeEventListener("authChange", updateAuth);
    }, []);

    return {
        token,
        isLoggedIn: !!token
    };
}
