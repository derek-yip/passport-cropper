import React from "react";
import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        <p className="logo">
          Derek Yip's Project - Passport Photo Cropper
        </p>
        <div className="social-icons">
          <a href="https://github.com/derek-yip" target="_blank">
            <FaGithub className="icon github-icon" />
          </a>
          <a href="https://www.linkedin.com/in/derekyip-74272921b" target="_blank">
            <FaLinkedin className="icon linkedIn-icon" />
          </a>
          <a href="https://www.buymeacoffee.com/derekyip" target="_blank">
            <FaHeart className="icon heart-icon" />
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;