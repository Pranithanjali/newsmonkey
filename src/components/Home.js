import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      <h1 className="home-title">Welcome to <span>NewsMonkey</span></h1>
      <p className="home-subtitle">
        Discover the world's most important stories, curated for modern readers 
        who value quality journalism.
      </p>
      <Link to="/business">
        <button className="home-btn">✨ Explore Stories ✨</button>
      </Link>
    </div>
  );
}

