import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaFile, FaFolder ,FaSun, FaMoon} from "react-icons/fa";
import "./Home.css"; // Подключаем CSS
import Navbar from "./Navbar";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(false); 
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [inputMode, setInputMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [aiPercentage, setAiPercentage] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const link = "http://localhost:8000"

  const getResult = async (filename) =>{
    try {
      setIsChecking(true);
      let retries = 10;
      let resultData = null;

      while (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const resultResponse = await fetch(`${link}/result/by-filename/${filename}`, {
          method: "GET",
        });

        if (resultResponse.ok) {
          resultData = await resultResponse.json();
          break;
        }

        retries--;
      }

      if (resultData) {
        setAiPercentage(resultData.result);
        setMessage("Result received!");
      } else {
        setMessage("Result not found. Please try again later.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setMessage("An error occurred. Please try again.");
    }
    finally {
      setIsChecking(false);
    }
  }

  const download_report = async () => {
    if (!selectedFile && selectedFiles.length === 0) {
      alert("Please select a file or folder first!");
      return;
    }
    let filename = selectedFile.name
    try {
        const response = await fetch(`${link}/generate_pdf/${filename}`);
        console.log(filename)
        if (!response.ok) {
            throw new Error("Failed to generate report");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}_report.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error downloading report:", error);
    }
};


  const checkForAI = async () => {
    if(inputMode == "manual"){
      const blob = new Blob([inputValue], { type: 'text/plain' });
      const file = new File([blob], 'output.txt', { type: 'text/plain' });
      setSelectedFile(file);
    }
    if (!selectedFile && selectedFiles.length === 0) {
      alert("Please select a file or folder first!");
      return;
    }
  
    const formData = new FormData();
    let userEmail = "guest@guest.com"; 
  
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(link + "/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          userEmail = data.email;
        } else {
          console.warn("Failed to fetch user data, using guest email.");
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    }
  
    formData.append("email", userEmail); 
    formData.append("filetype",activeTab);
  
    if (selectedFile) {
      formData.append("files", selectedFile);
    } else {
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
      } else {
        console.log("File uploaded successfully!");

        const filename = selectedFile.name;
        getResult(filename)
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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
  
const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};

const handleFolderChange = (event) => {
  setSelectedFiles(Array.from(event.target.files));
};

  return (
    <div className={`home-container ${darkMode ? "dark" : ""}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
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
                <div className="file-upload-section">
                  <div className="file-icon-placeholder">
                    <FaFile size={60} />
                  </div>
                  <p className="file-drop-text">Drop file here or select file</p>
                  <label htmlFor="file-input" className="select-file-button">
                    Select an file
                  </label>
                  <input id="file-input" type="file" onChange={handleFileChange} style={{ display: "none" }} />
                  {selectedFile && <p className="selected-file-name">Selected File: {selectedFile.name}</p>}
                </div>
              ) :  inputMode === "folder" ? (
                <div className="folder-upload-section">
                  <div className="folder-icon-placeholder">
                    <FaFolder size={60} />
                  </div>
                  <p className="folder-drop-text">Drop folder here or select folder</p>
                  <label htmlFor="folder-input" className="select-folder-button">
                    Select folder
                  </label>
                  <input id="folder-input" type="file" webkitdirectory="" directory="" multiple onChange={handleFolderChange} style={{ display: "none" }} />
                  {selectedFiles.length > 0 && (
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
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
              <text x="60" y="35" fontSize="18" textAnchor="middle" fill="#333">{aiPercentage}</text>
            </svg>
          </div>
          {isChecking ? (
                <div className="loading-spinner"></div>
              ) : (
                <button className="check-button" onClick={checkForAI}>Check</button>
              )}      {!isChecking && <button className="download-button" onClick={download_report}>report</button>}
   </div>
              
      </div>
    </div>
  );
};

export default Home;
