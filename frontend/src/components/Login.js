import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      setMessage("Login successful!");
      navigate("/home");
    } catch (error) {
      setMessage(error.message || "Login failed");
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
      {message && <p className="error-message">{message}</p>}
      
      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

export default Login;
