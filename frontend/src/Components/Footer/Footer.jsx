import { FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "/logo.jpeg"

import "./Footer.css"
export default function Footer() {
    return (
        <div className="footer-wrapper">
            {/* Main footer*/}
            <div className="footer">
                <div className="two-column">
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <a>Mohammed Mujahid M</a>
                        <a>Email: mcubemujahid@gmail.com</a>
                        <a>Bengaluru, Karnataka, India.</a>
                    </div>
                    <div className="footer-section">
                        <h4>Info</h4>
                        <a>Privacy Policy</a>
                        <a>Cookie Policy</a>
                        <a>FAQ</a>
                    </div>
                </div>
                <div className="two-column">
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                        <Link to="/schedule">Schedule</Link>
                        <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-left">
                    <img src={logo} alt="logo" className="footer-logo" />
                    <p className="footer-copy">2025 Ⓒ Event Planner. All rights reserved</p>
                </div>
                <div className="footer-social">
                    <a href="https://x.com/MCUBE_87" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                    <a href="https://x.com/MCUBE_87" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    <a href="https://github.com/Mcubeadmin" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                </div>
            </div>
        </div>
    );
}

//  {/* Sub footer */}
//             <div className="sub-footer">
//                 <div className="two-column">
//                     <div className="column">
//                         <h4>Bus Hire Cities</h4>
//                         <a>Chennai</a>
//                         <a>Salem</a>
//                         <a>Trichy</a>
//                         <a>Coimbatore</a>
//                         <a>Madurai</a>
//                     </div>
//                     <div className="column">
//                         <h4>Bus Hire Cities</h4>
//                         <a>Chennai</a>
//                         <a>Salem</a>
//                         <a>Trichy</a>
//                         <a>Coimbatore</a>
//                         <a>Madurai</a>
//                     </div>
//                 </div>
//                 <div className="two-column">
//                     <div className="column">
//                         <h4>Bus Hire Cities</h4>
//                         <a>Chennai</a>
//                         <a>Salem</a>
//                         <a>Trichy</a>
//                         <a>Coimbatore</a>
//                         <a>Madurai</a>
//                     </div>
//                     <div className="column">
//                         <h4>Bus Hire Cities</h4>
//                         <a>Chennai</a>
//                         <a>Salem</a>
//                         <a>Trichy</a>
//                         <a>Coimbatore</a>
//                         <a>Madurai</a>
//                     </div>
//                 </div>
//             </div>
