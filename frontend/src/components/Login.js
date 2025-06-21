import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Notification from "./Notification"; // Import the Notification component
import './Register.css'
function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null); // State for notifications
  const navigate = useNavigate();
  const link = 'http://193.169.105.43:8000';

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${link}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      setNotification({ message: "Login successful!", type: 'success' });
      navigate("/home");
    } catch (error) {
      setNotification({ message: error.message || "Login failed", type: 'error' });
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Sign in</button>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification(null)}
        />
      )}

      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

export default Login;