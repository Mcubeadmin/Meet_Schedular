import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "swiper/css";
import toast from "react-hot-toast";
import "./Home.css"
import { Button } from "@mui/material";

export default function Home(){
    const [toastShown, setToastShown] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!toastShown && location.state?.message) {
            toast.success(location.state.message);
            setToastShown(true);
            
            navigate(location.pathname, { replace: true, state: {} });
        }
        
    }, [location.state, toastShown, navigate, location.pathname]); 
    
    const homeButtonSx = {                
        margin: '2rem',
        background: '#3f3f3f',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        textTransform: 'none', // Prevents MUI from forcing uppercase
        '&:hover': {
        background: '#2f2f2f', // Need to define hover manually with sx
        },
        cursor: 'pointer',
        pointerEvents: 'auto',
        minWidth:'auto'
    }

    return(
        <div className="home-page">
            <section>
                <video
                    className="video-hero__video"
                    autoPlay
                    muted
                    loop={true}
                    playsInline
                    preload="metadata"
                    poster=""
                >
                    <source src="seminar.mp4" type="video/mp4" />
                </video>
                <div className="video-hero__overlay">
                    <div className="video-hero__content">
                        <h1>Organize your Events with ease!</h1>
                        <p className="video-hero__subtitle">Your one stop helper to create Agenda and Schedule your events</p>
                        <Button variant="contained" 
                        sx={homeButtonSx}
                        className="home-Btn" component={Link} to="/about">Learn more</Button>
                        <Button 
                        variant="contained" 
                        sx={homeButtonSx}
                        component="a"
                        href="https://github.com/Mcubeadmin/Meet_Schedular/tree/main"
                        target="_blank"
                        rel="noopener noreferrer">
                            Contribute
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}


