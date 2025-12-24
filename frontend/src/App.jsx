import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { lazy, Suspense } from 'react';
import './App.css'

import ProtectedRoute from './Components/ProtectedRoute.jsx'

const About = lazy(() => import('./Pages/About/About.jsx'));
const Home = lazy(() => import('./Pages/Home/Home.jsx'));
const Login = lazy(() => import('./Pages/Login/Login.jsx'));
const Verify = lazy(() => import('./Pages/Login/Verify.jsx'));
const Register = lazy(() => import('./Pages/Login/Register.jsx'));
const Schedule = lazy(() => import('./Pages/Schedule/Schedule.jsx'));
const NotFound = lazy(() => import('./Pages/NotFound.jsx'));

import Navbar from "./Components/Navbar/Navbar.jsx"
import Footer from "./Components/Footer/Footer.jsx"

import ScrollToTop from './Components/ScrollUpButton/ScrollToTop.jsx'
import ScrollUpButton from "./Components/ScrollUpButton/ScrollUpButton.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Suspense fallback={<div style={{margin: "100px"}}>Loading Page...</div>}>
      <ScrollToTop />
      <Navbar />
        <main className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/schedule"
              element={
                <ProtectedRoute>
                <Schedule />
                </ProtectedRoute>
                } />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
        </main>
      </Suspense>
      <ScrollUpButton />
      <Footer />
    </BrowserRouter>
  )
}

export default App
