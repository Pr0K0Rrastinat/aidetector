import React, { useState, useEffect, useRef } from 'react';
import './Trainmodelpage.css';
import Navbar from '../components/Navbar';

const TrainModelPage = ({ isDarkMode, toggleDarkMode }) => {
  const [activeButton, setActiveButton] = useState('text');
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const link = "http://localhost:8000"

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
    let fileToUpload = selectedFile;

    if (textareaValue.trim()) {
      console.log("Generating file from textarea...");

      const blob = new Blob([textareaValue], { type: 'text/plain' });
      fileToUpload = new File([blob], 'output.txt', { type: 'text/plain' });
      setSelectedFile(fileToUpload)
      setTextareaValue("")
    }
    if (!fileToUpload && selectedFiles.length === 0) {
      alert("Please select a file, folder, or enter text!");
      return;
    }
    console.log(activeButton)

    const filetype = activeButton;

    console.log(filetype)
    if (!filetype) {
      alert("Please select a mode (AI or H) before uploading.");
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
        alert("🚀 Модель начала обучение!");
      }
      
      setSelectedFile(null);
      setSelectedFiles([]);
      handleModeSwitch("")

      console.log(result);
  
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Ошибка загрузки файлов.");
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
      {(selectedFile || selectedFiles.length > 0) && (
          <button className="clear-btn" onClick={() => {
            setSelectedFile(null);
            setSelectedFiles([]);
            handleModeSwitch("")
          }}>
            Clear Selection
          </button>
        )}
        <button className="upload-btn" disabled={uploadDisabled} onClick={upload}>
          Upload
        </button>
      </div>
    </main>
  );
};

export default TrainModelPage;
