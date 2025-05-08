import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Notification from "./Notification"; // Import the Notification component
import "./Register.css"
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // State for notifications
  const navigate = useNavigate();
  const link = 'http://185.209.21.152:8000';
  const [secondPassword, setSecondPassword] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmPassword = (e) => {
    setSecondPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password.length < 6) {
      setNotification({ message: "Password is too weak. Minimum 6 characters required.", type: 'warning' });
      setLoading(false);
      return;
    }

    if (formData.password !== secondPassword) {
      setNotification({ message: "Passwords do not match.", type: 'warning' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${link}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Registration error");
      }

      // Save the received token
      localStorage.setItem('token', data.access_token);
      setNotification({ message: "Registration successful!", type: 'success' });
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="user@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={secondPassword}
          onChange={handleConfirmPassword}
          required
        />
        
      </form>
      <button type="submit" disabled={loading}>
          {loading ? "Registration..." : "Sign Up"}
        </button>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification(null)}
        />
      )}

      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;