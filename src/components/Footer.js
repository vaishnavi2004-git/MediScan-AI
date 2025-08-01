import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div>© {new Date().getFullYear()} AI Health Analyzer. All rights reserved.</div>
      <div style={{marginTop:'0.5em'}}>
        <a href="/contact">Contact Us</a> | <a href="/about">About Us</a>
      </div>
    </footer>
  );
}
