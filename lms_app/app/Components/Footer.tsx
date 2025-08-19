'use client';
import { useEffect, useState } from 'react';

const Footer = () => {
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
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      color: "white",
      padding: "20px 0",
      borderTop: "2px solid #007bff",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      zIndex: 999
    }}>
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <div style={{ fontSize: "14px" }}>
              <span style={{ color: "#007bff", fontWeight: "bold" }}>
                © 2025 Learning Management System. All rights reserved.
              </span>
              <span style={{ color: "white", margin: "0 10px" }}>,</span>
              <span style={{ color: "white" }}>
                Student: <strong>Arunjot Babra</strong>
              </span>
              <span style={{ color: "white", margin: "0 10px" }}>,</span>
              <span style={{ color: "white" }}>
                Student Number: <strong>21406232</strong>
              </span>
              <span style={{ color: "white", margin: "0 10px" }}>,</span>
              <span style={{ color: "#007bff" }}>
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