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
      borderTop: "2px solid var(--footer-border-color)"
    }} className="theme-transition">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <div style={{ fontSize: "14px" }}>
              <span className="footer-meta" style={{ color: "var(--text-primary)", fontWeight: "bold" }}>
                © 2025 Learning Management System. All rights reserved.
              </span>
              <span className="footer-meta" style={{ color: "var(--text-primary)", margin: "0 10px" }}>|</span>
              <span className="footer-meta" style={{ color: "var(--text-primary)" }}>
                Student: <strong>Arunjot Babra</strong>
              </span>
              <span className="footer-meta" style={{ color: "var(--text-primary)", margin: "0 10px" }}>|</span>
              <span className="footer-meta" style={{ color: "var(--text-primary)" }}>
                Student Number: <strong>21406232</strong>
              </span>
              <span className="footer-meta" style={{ color: "var(--text-primary)", margin: "0 10px" }}>|</span>
              <span className="footer-meta" style={{ color: "var(--text-primary)" }}>
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