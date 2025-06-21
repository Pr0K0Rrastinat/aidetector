import React, { useState, useEffect, useRef } from 'react';
import './Trainmodelpage.css';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';

const TrainModelPage = ({ isDarkMode, toggleDarkMode }) => {
  const [activeButton, setActiveButton] = useState('text');
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [isChecking, setIsChecking] = useState(false); 
  const folderInputRef = useRef(null);
  const link = 'http://193.169.105.43:8000';
  const [notification, setNotification] = useState(null); 


  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleModeSwitch = (mode) => {
    setActiveButton(mode);
    if (mode === 'ai' || mode === 'h') {
      setUploadDisabled(false);
    } else {
      setUploadDisabled(true);
    }
  };

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

  const upload = async () => {
    setIsChecking(true);
    let fileToUpload = selectedFile;
    if (textareaValue.trim()) {
      console.log("Generating file from textarea...");
      const blob = new Blob([textareaValue], { type: 'text/plain' });
      fileToUpload = new File([blob], 'output.txt', { type: 'text/plain' });
      setSelectedFile(fileToUpload);
      setTextareaValue("");
    }
    if (!fileToUpload && selectedFiles.length === 0 && !textareaValue.trim()) {
      setNotification({ message: "Please select a file, folder, or enter text!", type: 'warning' });
      setIsChecking(false);
      return;
    }
    console.log(activeButton);
  
    const filetype = activeButton;
  
    console.log(filetype);
    if (!filetype) {
      setNotification({ message: "Please select a mode (AI or H) before uploading.", type: 'warning' });
      setIsChecking(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("filetype", filetype);
    formData.append("email", "user@example.com");
  
    if (fileToUpload) {
      formData.append("files", fileToUpload);
    } else {
      selectedFiles.forEach(file => {
        formData.append("files", file);
      });
    }
  
    try {
      const response = await fetch(`${link}/training-data/`, {
        method: "POST",
        body: formData
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.detail || "Failed to upload files.");
      }
  
      if (result.training_started) {
        setNotification({ message: "File successfully uploaded!", type: 'success' });
      }
  
      setSelectedFile(null);
      setSelectedFiles([]);
      handleModeSwitch("");
      setIsChecking(false);
  
      console.log(result);
  
    } catch (error) {
      console.error("Error uploading files:", error);
      setNotification({ message: "Error uploading files.", type: 'error' });
      setIsChecking(false);
    }
  };
  
  
  const handleFolderChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };
  

  return (
    <main className={`train-model-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

      <div className="white-box">
        {!selectedFile && selectedFiles.length === 0 && (
          <textarea
            placeholder="Enter"
            value={textareaValue}
            onChange={handleTextareaInput}
          />
        )}

        {selectedFile && (
          <p>Chosen file: <strong>{selectedFile.name}</strong></p>
        )}

        {/* Если выбрана папка */}
        {selectedFiles.length > 0 && (
          <div>
            <p>Chosen folder:</p>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.webkitRelativePath}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="icons">
          <div className="left-icons">
            <button className="icon-btn" onClick={handleFileClick}>📄</button>
            {/* <button className="icon-btn" onClick={handleFolderClick}>📁</button> */}

            {/* Скрытые инпуты */}
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

            <button
              className={`icon-btn ${activeButton === 'ai' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('ai')}
            >
              AI
            </button>
            <button
              className={`icon-btn ${activeButton === 'h' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('h')}
            >
              H
            </button>
          </div>
        </div>
      </div>

      <div className="upload-container">
        {(selectedFile || selectedFiles.length > 0 || textareaValue.trim()) && (
          <button className="clear-btn" onClick={() => {
            setSelectedFile(null);
            setSelectedFiles([]);
            setTextareaValue("");
            handleModeSwitch("");
          }}>
            Clear Selection
          </button>
        )}
        <button className="upload-btn" onClick={upload}>
          Upload
        </button>
      </div>

      {isChecking && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification(null)}
        />
      )}
    </main>
  );
};

export default TrainModelPage;