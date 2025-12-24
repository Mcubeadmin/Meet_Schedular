import { useState, useEffect } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import "./ScrollUpButton.css"

export default function ScrollUpButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 100) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        }
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
        
    }, []);

    const handleScrollUp = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    };
    

    return (
        <button 
            className={`scroll-up-btn ${visible ? "show" : ""}`} 
            onClick={handleScrollUp}>
            <ArrowUpwardIcon />
        </button>

    );
}