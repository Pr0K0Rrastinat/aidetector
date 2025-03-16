import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaFile, FaFolder ,FaSun, FaMoon} from "react-icons/fa";
import "./Home.css"; // Подключаем CSS

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [inputMode, setInputMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [aiPercentage, setAiPercentage] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const checkForAI = () => {
    const percentage = Math.floor(Math.random() * 101); // Генерация случайного процента
    setAiPercentage(percentage);
  };
  const getStrokeColor = () => {
    if (aiPercentage < 30) return "#22c55e"; // Зеленый
    if (aiPercentage < 50) return "#f59e0b"; // Оранжевый
    return "#ef4444"; // Красный
  };
  useEffect(() => {
    if (darkMode) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}, [darkMode]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please log in.");
        }

        console.log("Fetching user data with token:", token);

        const response = await fetch("http://localhost:8000/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch user data");
        }

        const data = await response.json();
        console.log("User data received:", data);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <div className={`home-container ${darkMode ? "dark" : ""}`}>
      <nav className="navbar">
        <div className="nav-links">
          <a href="#">About</a>
          <a href="#">Train Model</a>
          <a href="#">Guide</a>
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
      
      <div className="home-wrapper">
        <div className="big-box">
          <div className="tabs">
            <button className={`tab-button ${activeTab === "text" ? "active" : ""}`} onClick={() => setActiveTab("text")}>
              Text
            </button>
            <button className={`tab-button ${activeTab === "code" ? "active" : ""}`} onClick={() => setActiveTab("code")}>
              Code
            </button>
          </div>

          <div className="content">
            <div className="sidebar">
              <FaPencilAlt className={`sidebar-icon ${inputMode === "manual" ? "active" : ""}`} onClick={() => setInputMode("manual")} />
              <FaFile className={`sidebar-icon ${inputMode === "file" ? "active" : ""}`} onClick={() => setInputMode("file")} />
              <FaFolder className={`sidebar-icon ${inputMode === "folder" ? "active" : ""}`} onClick={() => setInputMode("folder")} />
            </div>

            <div className="content-area">
              {inputMode === "manual" ? (
                <textarea className="input-field" placeholder="Enter text..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              ) : inputMode === "file" ? (
                <p className="text-content">File input selected</p>
              ) : inputMode === "folder" ? (
                <p className="text-content">Folder input selected</p>
              ) : (
                <p className="text-content">Select an input method...</p>
              )}
            </div>
          </div>
        </div>

        <div className="small-box">
          <div className="ai-indicator-wrapper">
            <svg className="ai-indicator" width="120" height="100" viewBox="0 0 120 60">
              <path 
                d="M10,40 A40,40 0 0,1 110,40" 
                fill="none" 
                stroke="#e5e7eb" 
                strokeWidth="10"
              />
              <path 
                d="M10,40 A40,40 0 0,1 110,40" 
                fill="none" 
                stroke={getStrokeColor()} 
                strokeWidth="10" 
                strokeDasharray={`${(aiPercentage / 100) * 80}, 80`}
              />
              <text x="60" y="35" fontSize="18" textAnchor="middle" fill="#333">{aiPercentage}%</text>
            </svg>
          </div>
          <button className="check-button" onClick={checkForAI}>Check</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
