import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css"
import axios from "axios"

export default function Verify() {
const [params] = useSearchParams();
    // const navigate = useNavigate(); // Keep navigate if you want to redirect after success/failure
    
    useEffect(() => {
        const token = params.get("token");
        if (!token) {
            console.error("Verification error! Token missing.");
            return;
        }

        // The token is present, make the API call
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify?token=${token}`)
        .then(response => {
            // Check the backend response for the correct message key
            toast.success(response.data.message || "Email verified successfully!"); 
        })
        .catch(error => {
            const errorMessage = error.response?.data?.error || "An unknown verification error occurred.";
            console.error("Verification API Error:", errorMessage);
            toast.error(errorMessage);
        });
        
    }, [params]);

    return <div className="login-container">
            <h1>Verification Successful. You can close this page!
            </h1>
        </div>
}