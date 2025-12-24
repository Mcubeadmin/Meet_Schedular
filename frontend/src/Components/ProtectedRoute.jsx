import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth();
    useEffect(() => {
        if (!isLoggedIn) {
            toast.error("Please log in!")
        }
    }, [isLoggedIn]);

    
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children
}