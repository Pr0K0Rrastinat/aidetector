import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import "./Navbar.css"; // Подключаем CSS для Navbar

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="/about">About Us</a>
        <a href="/trainmodelpage">Train Model</a>
        <a href="/guidepage">Guide</a>
        <a href="#">Profile</a>
      </div>
      <div className="nav-icons">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaMoon /> : <FaSun />}
        </button>
        <select className="language-selector">
          <option value="en">EN</option>
          <option value="ru">RU</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;