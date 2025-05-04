import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import Navbar from './Navbar';

const Home = ({ isDarkMode, toggleDarkMode }) => {
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedFolderFiles, setSelectedFolderFiles] = useState([]);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(false); 
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [aiPercentage, setAiPercentage] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [accesDownload,setAccesDownload] = useState(false);
  const link = 'http://185.209.21.152:8000';

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
      setAccesDownload(true)
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
  let fileToUpload = selectedFile;

  if (textareaValue.trim()) {
    console.log("Generating file from textarea...");

    const blob = new Blob([textareaValue], { type: 'text/plain' });
    fileToUpload = new File([blob], 'output.txt', { type: 'text/plain' });
    setSelectedFile(fileToUpload)
  }

  if (!fileToUpload && selectedFolderFiles.length === 0) {
    alert("Please select a file, folder, or enter text!");
    return;
  }
  
  setTextareaValue("")
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
  formData.append("filetype", activeTab);

  if (fileToUpload) {
    formData.append("files", fileToUpload);
  } else {
    selectedFolderFiles.forEach((file) => {
      formData.append("files", file);
    });
  }
  

  try {
    const response = await fetch(`${link}/upload/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Upload failed:", errorData);
    } else {
      console.log("File uploaded successfully!");

      const filename = fileToUpload ? fileToUpload.name : selectedFiles[0].name;
      getResult(filename);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const getStrokeColor = () => {
  const percentage = Number(aiPercentage);
  if (percentage < 30) return "#22c55e";
  if (percentage < 50) return "#f59e0b";
  return "#ef4444";
};
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (
      (textareaValue.trim() && !selectedFile && selectedFolderFiles.length === 0) ||
      (selectedFile && !textareaValue && selectedFolderFiles.length === 0) ||
      (selectedFolderFiles.length > 0 && !selectedFile && !textareaValue)
    ) {
      setUploadDisabled(false);
    } else {
      setUploadDisabled(true);
    }
  }, [textareaValue, selectedFile, selectedFolderFiles]);
  

  const handleTextareaInput = (e) => {
    setTextareaValue(e.target.value);
  };
  

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFolderClick = () => {
    folderInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTextareaValue("");
      setSelectedFile(file);
      setUploadDisabled(false);
    }
  };
  
  
  const handleFolderChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFolderFiles(files);
      setUploadDisabled(false);
    }
  };
  

  return (
    <main className={`home-model-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className='main-sector'>
          <div className="white-box">
            {!selectedFile && selectedFolderFiles.length === 0 && (
              <textarea
                placeholder="Enter"
                value={textareaValue}
                onChange={handleTextareaInput}
              />
            )}
            {selectedFile && (
              <p>Chosen file: <strong>{selectedFile.name}</strong></p>
            )}
            {selectedFolderFiles.length > 0 && (
              <div>
                <p>Chosen folder:</p>
                <ul>
                  {selectedFolderFiles.map((file, index) => (
                    <li key={index}>{file.webkitRelativePath}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="icons">
              <div className="left-icons">
                <button className="icon-btn" onClick={handleFileClick}>📄</button>
                {/* <button className="icon-btn" onClick={handleFolderClick}>📁</button> */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {/* <input
                  type="file"
                  ref={folderInputRef}
                  onChange={handleFolderChange}
                  style={{ display: 'none' }}
                  webkitdirectory="true"
                  directory="true"
                  multiple
                /> */}
              </div>
              <div className="right-icons">
              {(isChecking === false && (selectedFile || selectedFolderFiles.length > 0)) && (
                <button className="clear-btn" onClick={() => {
                  setSelectedFile(null);
                  setSelectedFolderFiles([]);
                }}>
                  Clear Selection
                </button>
              )}
              {isChecking ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <button className="check-btn" onClick={checkForAI} disabled={uploadDisabled}>Check</button>
                  )}
              
              </div>
            </div>
          </div>
        <div className='place-holder' width="200vh"></div>
        <div className="small-box">
              <div className="ai-indicator-wrapper">
                <svg className="ai-indicator" width="150" height="100" viewBox="4 5 120 15">
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
              {accesDownload ? (
                    <button className="download-button" onClick={download_report}>download</button>
                  ) : (
                    <div> </div>
                  )}
        </div>
      </div>
    </main>
  );
};

export default Home;
