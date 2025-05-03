// AboutUs.jsx
import React, { useState, useEffect, useRef } from 'react';
import "./AboutUs.css";
import Navbar from "../components/Navbar";
import aldiyarImg from '../statics/jasik.jpg';
import dilnazImg from '../statics/d.jpg';
import arnurImg from '../statics/asyq.jpg';


const About = ({ isDarkMode, toggleDarkMode }) => {
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

    useEffect(() => {
      document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);
  

  const closePopups = () => {
    setShowLanguagePopup(false);
    setShowProfilePopup(false);
  };

  return (
    <div
    className={`App ${isDarkMode ? "dark-mode" : ""}`}
    onClick={closePopups}
  >
    <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <section className="main-container">
        <div className="main-text">
          <h1>Our Team</h1>
          <p>
            We are a team of three passionate individuals developing an AI-powered tool that analyzes and detects the content of texts — such as essays and articles — to evaluate meaning, structure, and originality.
          </p>
        </div>
        <div className="team-visual">
          <div className="diamond-grid">
            <div className="diamond">
              <img
                src={aldiyarImg}
                alt="Aldiyar"
              />
            </div>
            <div className="diamond">
              <img
                src={dilnazImg}
                alt="Dilnaz"
              />
            </div>
            <div className="diamond">
              <img
                src={arnurImg}
                alt="Arnur"
              />
            </div>
          </div>
          <div className="caption-grid">
            <div className="caption">
              <h3>Aldiyar Zhassulan</h3>
              <p>Full-stack Developer</p>
            </div>
            <div className="caption">
              <h3>Khismetullina Dilnaz</h3>
              <p>Team Lead, UX/UI Designer</p>
            </div>
            <div className="caption">
              <h3>Sydyk Arnur</h3>
              <p>Data Scientist / ML Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Разделы */}
      <section className="section-boxes">
        <div className="section-box">
          <h4>Culture</h4>
          <p>
            We value creativity, freedom, and collaboration. Every team member has a voice and is encouraged to contribute ideas and improvements.
          </p>
        </div>
        <div className="section-box">
          <h4>Workplace</h4>
          <p>
            Remote-friendly with flexible hours. Each of us has a personal creative space and full ownership of our work.
          </p>
        </div>
      </section>

      {/* Футер */}
      <footer>
        <div className="footer-content">
          <h4>Contact Us</h4>
          <p>Email: truework_ai.team@gmail.com</p>
          <p>Phone: +7 (777) 123-4567</p>
        </div>
      </footer>
    </div>
  );
};

export default About;