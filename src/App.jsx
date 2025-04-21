import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import RenterLogin from "./components/RenterLogin";
import Squares from "./blocks/Squares";
import Dashboard from "./components/Dashboard";
import UserLogin from "./components/UserLogin";
import Send from "./components/Send";
import Search from "./components/Search";
import About from "./components/About";
import Homes from "./components/Homes";
import Request from "./components/Request";
import Rdashboard from "./components/Rdashboard";

import CommitList from "./components/CommitList";
import UserHomes from "./components/UserHomes";

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  });

  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", userType);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("userType");
    }
  }, [user, userType]);

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    alert("Logged out successfully!");
    window.location.href = "/";
  };

  return (
    <Router>
      <Squares speed={0.5} squareSize={60} direction="diagonal" borderColor="#fff" hoverFillColor="#222" />
      <Navbar onLogout={handleLogout} setUser={setUser} user={user} userType={userType} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} setUserType={setUserType} />} />
        <Route path="/renterlogin" element={<RenterLogin setUser={setUser} setUserType={setUserType} />} />
        <Route path="/userlogin" element={<UserLogin setUser={setUser} setUserType={setUserType} />} />
  
        
        
        <Route path="/commit" element={<CommitList />} />
        

        {userType === "renter" && (
          <>
            <Route path="/rdashboard" element={<Rdashboard />} />
            <Route path="/renter" element={<Send />} />
            <Route path="/homes" element={<Homes />} />
            
            <Route path="/request" element={<Request setUser={setUser} setUserType={setUserType}  />} />
          </>
        )}
        {userType === "user" && (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/userhomes" element={<UserHomes />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
