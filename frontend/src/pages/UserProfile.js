import React, { useState, useEffect } from "react";
import './UserProfile.css';
import Navbar from '../components/Navbar';
import { MdDeleteForever } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import AuthErrorModal from "../components/AuthErrorModal";

const UserProfile = ({isDarkMode,toggleDarkMode}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [userData, setUserData] = useState({ email: '', results: [] });
    const link = 'http://185.209.21.152:8000';
    const [username,setUsername] = useState("")
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true" || false;
    });
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const filteredResults = userData.results.filter(file =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const download_report = async (file_uuid,filename) => {
        if (!filename || filename=== 0) {
            alert("Пожалуйста, сначала выберите файл!");
            return;
        }
    
        try {
            const response = await fetch(`${link}/generate_pdf/${file_uuid}`);
            console.log(file_uuid);
            if (!response.ok) {
                throw new Error("Не удалось сгенерировать отчет");
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
    
            const a = document.createElement("a");
            a.href = url;
            a.download = `${filename}_report${file_uuid}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error("Ошибка при скачивании отчета:", error);
        }
    };

    const delete_report = async (filename,file_uuid) => {
      if (!filename || filename.length === 0) {
          alert("Please select a file or folder first!");
          return;
      }

      try {
          const response = await fetch(`${link}/result/delete/${userData.email}/${file_uuid}`, {
              method: 'POST',
          });
          console.log(filename);
          console.log(file_uuid);
          console.log(userData.email);
          if (!response.ok) {
              throw new Error("Failed to delete report");
          }

          console.log("Successfully deleted");

          setUserData({
              ...userData,
              results: userData.results.filter(result => result.filename !== filename),
          });

      } catch (error) {
          console.error("Error deleting report:", error);
          alert("Failed to delete the report. Please check the console for errors.");
      }
  };


    useEffect(() => {
        if (showModal) {
            document.body.classList.add('auth-error-modal-open');
        } else {
            document.body.classList.remove('auth-error-modal-open');
        }
    }, [showModal]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                console.log('Token from localStorage:', token);

                if (!token) {
                    throw new Error('No access token found');
                }

                const userResponse = await fetch(`${link}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'application/json'
                    }
                });

                if (!userResponse.ok) {
                    throw new Error(`HTTP error fetching user info! status: ${userResponse.status}`);
                }

                const userInfo = await userResponse.json();
                const userEmail = userInfo.email;
                console.log(userInfo.username)
                setUsername(userInfo.username)
                const resultsResponse = await fetch(link + `/result/by-email/${userEmail}`, {});

                if (!resultsResponse.ok) {
                    if (resultsResponse.status === 404) {
                        setUserData({ email: userEmail, results: [] }); 
                        console.log('No results found for user.');
                    } else {
                        throw new Error(`HTTP error fetching results! status: ${resultsResponse.status}`);
                    }
                } else {
                    const resultsData = await resultsResponse.json();
                    setUserData(resultsData);
                    console.log('Fetched data:', resultsData);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setShowModal(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

      useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
      }, [isDarkMode]);

    return (
        <div className="user-profile-container">
            <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : (
                <>
                    <div className="file-list-box">
                    <div className="user-info-box">
                        <div className="user-avatar" />
                        <div className="user-details">
                            <p className="user-name">{username}</p>
                            <p className="user-email">{userData.email}</p>
                        </div>
                        </div>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <CiSearch className="search-icon" onClick={handleSearch} /> {}
                        </div>
                        {filteredResults.map((file, index) => (
                            <div key={index} className="file-item">
                                <div className="file-info">
                                <div className="file-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                    <polyline points="13 2 13 9 20 9"></polyline>
                                    </svg>
                                </div>
                                <div className="file-details">
                                    <div className="file-name">{file.filename}</div>
                                    <div className="file-type">{file.filetype}</div>
                                </div>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-percentage">{file.result}</div>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: `${file.result}` }}></div>
                                    </div>
                                </div>
                                <div className="actions">
                                <button className="report-btn" onClick={() => download_report(file.file_uuid,file.filename)}>
                                    <IoMdDownload />
                                </button>
                                <button className="delete-btn" onClick={() => delete_report(file.filename,file.file_uuid)}>
                                    <MdDeleteForever />
                                </button>
                                </div>
                            </div>
                            ))}
                    </div>
                    <AuthErrorModal isOpen={showModal} />
                </>
            )}
        </div>
    );
};

export default UserProfile;