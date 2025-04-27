import React, { useState, useEffect } from 'react';
import './Trainmodelpage.css';
import Navbar from '../components/Navbar';

const TrainModelPage = ({isDarkMode,toggleDarkMode}) => {
  const [activeButton, setActiveButton] = useState('text');
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [textareaValue, setTextareaValue] = useState('');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleModeSwitch = (mode) => {
    setActiveButton(mode);
    setUploadDisabled(false);
  };

  const handleTextareaInput = (e) => {
    setTextareaValue(e.target.value);
  };


  return (
    <main className={`train-model-container ${isDarkMode ? 'dark-mode' : ''}`}>
     <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className="white-box">
        <textarea
          placeholder="Enter"
          value={textareaValue}
          onChange={handleTextareaInput}
        />
        <div className="icons">
          <div className="left-icons">
            <button className="icon-btn">📄</button>
            <button className="icon-btn">📁</button>
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
        <button className="upload-btn" disabled={uploadDisabled}>
          Upload
        </button>
      </div>
    </main>
  );
};

export default TrainModelPage;
