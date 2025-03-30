import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css"; // Подключаем стили
import Home  from "./components/Home";
import About from "./pages/About";
import TrainModelpage from "./pages/trainmodelpage";
import GuidePage from "./pages/guidepage";

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
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/about" element={<About />} />
            <Route path="/trainmodelpage" element={<TrainModelpage />} />
            <Route path="/guidepage" element={<GuidePage />} />

          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
