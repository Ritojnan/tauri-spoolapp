import React from 'react';
import '../css/TitleBar.css'; // Import your custom CSS for the title bar

const Macbar = () => {
    return (
        <div className="mac-title-bar">
          <div className="mac-title-bar-controls">
            <div className="mac-title-bar-button minimize" />
            <div className="mac-title-bar-button maximize" />
            <div className="mac-title-bar-button close" />
          </div>
          <div className="mac-title-bar-title">
            {/* <img src="/logo.png" height="25" className="spool-logo" alt="Logo" /> */}
            <p>spoolapp</p>
          </div>
        </div>
      );
    
};

export default Macbar;
