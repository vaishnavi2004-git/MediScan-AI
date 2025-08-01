import React from 'react';
import './HeroSection.css';
import heroImg from '../assets/health-hero-animation.svg'; // You can replace with your own SVG or GIF

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-text">
        <h1>Empowering Your Health with AI</h1>
        <p>
          Instantly analyze your medical reports, get actionable insights, and understand your health like never before. <br/>
          Our AI-driven dashboard makes complex data simple, secure, and accessible.
        </p>
      </div>
      <div className="hero-img">
        <img src={heroImg} alt="Healthcare Animation" style={{width:'340px',maxWidth:'100%'}} />
      </div>
    </section>
  );
}
