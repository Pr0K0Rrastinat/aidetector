import './i18n';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import "./App.css"; // Подключаем стили
import Home from "./components/Home.js";
import About from "./pages/About.js";
import TrainModelpage from "./pages/trainmodelpage.js";
import GuidePage from "./pages/guidepage.js";
import UserProfile from "./pages/UserProfile.js";
import Navbar from "./components/Navbar.js"; 
console.log("Navbar component in App:", Navbar);


function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <Router>
      <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home  isDarkMode={isDarkMode}  toggleDarkMode={toggleDarkMode}/>} />
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/about" element={<About  isDarkMode={isDarkMode}  toggleDarkMode={toggleDarkMode}/>} />
            <Route path="/trainmodelpage" element={<TrainModelpage isDarkMode={isDarkMode}  toggleDarkMode={toggleDarkMode}/>} />
            <Route path="/guidepage" element={<GuidePage />} />
            <Route path="/userpage" element={<UserProfile  isDarkMode={isDarkMode}  toggleDarkMode={toggleDarkMode}/>} />
          </Routes>
        
      </div>
    </Router>
  );
}

export default App;
