import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
const GuidePage = () =>{
    const [darkMode, setDarkMode] = useState(false);
    
    return(
        <div className="main">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            
        </div>

    )
};

export default GuidePage;