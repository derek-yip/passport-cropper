import React from "react";
import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";
import "./header.css";

function Header() {
  const GITHUB_LINK = import.meta.env.VITE_REACT_GITHUB_LINK;
  const LINKEDIN_LINK = import.meta.env.VITE_REACT_LINKEDIN_LINK;
  const PAYME_LINK = import.meta.env.VITE_REACT_PAYME_LINK;

  return (
    <header className="header">
      <nav className="navbar">
        <p className="title">Passport Photo Cropper</p>
        <div className="social-icons">
          <a href={GITHUB_LINK} target="_blank">
            <FaGithub className="icon github-icon" alt="GitHub" />
          </a>
          <a href={LINKEDIN_LINK} target="_blank">
            <FaLinkedin className="icon linkedIn-icon" alt="LinkedIn" />
          </a>
          <a href={PAYME_LINK} target="_blank">
            <FaHeart className="icon heart-icon" alt="Sponsor a Coffee" />
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
