'use client';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Get current date and format it
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  }, []);

  return (
    <footer style={{
      backgroundColor: "var(--footer-bg)",
      color: "var(--text-primary)",
      padding: "20px 0",
      borderTop: "2px solid var(--border-color)",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      zIndex: 999
    }} className="theme-transition">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <div style={{ fontSize: "14px" }}>
              <span style={{ color: "var(--accent-color)", fontWeight: "bold" }}>
                © 2025 Learning Management System. All rights reserved.
              </span>
              <span style={{ color: "var(--text-primary)", margin: "0 10px" }}>,</span>
              <span style={{ color: "var(--text-primary)" }}>
                Student: <strong>Arunjot Babra</strong>
              </span>
              <span style={{ color: "var(--text-primary)", margin: "0 10px" }}>,</span>
              <span style={{ color: "var(--text-primary)" }}>
                Student Number: <strong>21406232</strong>
              </span>
              <span style={{ color: "var(--text-primary)", margin: "0 10px" }}>,</span>
              <span style={{ color: "var(--accent-color)" }}>
                Date: <strong>{currentDate}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 