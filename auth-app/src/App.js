import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css"; // Подключаем стили
import Home  from "./components/Home";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="container">
        {user ? (
          <h2 className="welcome">Hello, {user.username}!</h2>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
