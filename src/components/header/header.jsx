import React from "react";
import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        <p className="title">
          Derek Yip's Project - Passport Photo Cropper
        </p>
        <div className="social-icons">
          <a href="https://github.com/derek-yip" target="_blank">
            <FaGithub className="icon github-icon" alt="GitHub"/>
          </a>
          <a href="https://www.linkedin.com/in/derekyip-74272921b" target="_blank">
            <FaLinkedin className="icon linkedIn-icon"  alt="LinkedIn"/>
          </a>
          <a href="https://www.buymeacoffee.com/derekyip" target="_blank">
            <FaHeart className="icon heart-icon"  alt="Sponsor a Coffee"/>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;