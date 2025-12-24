import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Box, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


import "./Navbar.css";
import logo from "/logo.jpeg";


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (location.pathname !== "/") {
      setScrolled(true);
      return;
    }
    else setScrolled(false);
    
    function handleScroll() {
        if (window.scrollY > 200) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
    
  }, [location.pathname]);
  
  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logout Successful!")
    window.dispatchEvent(new Event("authChange"));
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = (
    <>
      <Button className="navbar-link" component={Link} to="/">Home</Button>
      <Button className="navbar-link" component={Link} to="/about">About</Button>
      <Button className="navbar-link" component={Link} to="/schedule  ">Schedule</Button>
    </>
  )

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {[
          { text: 'Home', path:'/'},
          { text: 'About', path:'/about'},
          { text: 'Schedule', path:'/schedule'}
        ].map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            divider
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={item.text} sx={{ padding: "8px, 16px" }} />
          </ListItem>
        ))}
        <ListItem disablePadding divider>
          <ListItemText 
            primary={isLoggedIn ? 'Logout' : 'Login / Register'} 
            sx={{ padding: '8px 0px' }} 
            onClick={isLoggedIn ? handleLogout : () => {
              handleDrawerToggle();  
              navigate('/login');
              }
            } 
          />
        </ListItem>
      </List>
    </Box>
  );
  
  useEffect(() => {
    function updateAuth() {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }

    window.addEventListener("authChange", updateAuth);

    return () => window.removeEventListener("authChange", updateAuth);
  }, []);


  return (
    <AppBar className={`${scrolled ? "navbar-scrolled" : "navbar"}`}>
      <Toolbar className="navbar-toolbar">

        {/* LEFT SIDE */}
        <Box className="navbar-left">
          <img
            src={logo}
            alt="logo"
            className="navbar-logo"
          />

          <div variant="h6" sx={{ letterSpacing: 2 }}>
            <span className="navbar-brand-travels">Event</span>
            <span className="navbar-brand-travels">Planner</span>
          </div>

        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ display:"flex", alignItems:"center" }}>
          <div className="navbar-right">
            {navLinks}
            {isLoggedIn ? (
              <Button 
                variant="contained" 
                className="navbar-login-btn" 
                onClick={handleLogout}>
                  Logout
              </Button>
              ) : (
              <Button 
              variant="contained" 
              className="navbar-login-btn-r" 
              component={Link} to="/login">
                Login / Register
              </Button>
              )
            }
          </div>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            className="mobile-menu-icon"
          >
            <MenuIcon sx={{ color:"white", fontSize:"2rem" }}/>
          </IconButton>
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        className="mobile-drawer"
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
