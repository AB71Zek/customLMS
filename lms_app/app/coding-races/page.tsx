'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from '../Components/Footer';
import HamburgerMenu from '../Components/hamburgerMenu';
import { useTheme } from '../Components/ThemeContext';

export default function CodingRaces() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", marginBottom: "100px" }} data-theme={theme}>
      {/* Top Bar - Student Number, Title, Toggle Button, Hamburger Menu */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--header-bg)",
        padding: "15px 20px",
        zIndex: 1001,
        borderBottom: "2px solid var(--border-color)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }} className="theme-transition" data-theme={theme}>
        {/* Left - Student Number */}
        <div style={{
          backgroundColor: "var(--section-bg)",
          padding: "8px 15px",
          borderRadius: "20px",
          border: "2px solid var(--border-color)"
        }} className="theme-transition">
          <span style={{
            color: "var(--accent-color)",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            Student No: 21406232
          </span>
        </div>

        {/* Center - MOODLE LMS Title */}
        <div style={{
          position: "fixed",
          left: "50%",
          top: "15px",
          transform: "translateX(-50%)",
          zIndex: "1002"
        }}>
          <h1 style={{
            color: "var(--accent-color)",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            margin: 0,
            whiteSpace: "nowrap"
          }}>
            MOODLE LMS
          </h1>
        </div>

        {/* Right - Light/Dark Mode Toggle Button + Hamburger Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button 
            className="btn btn-outline-primary theme-transition theme-toggle-btn"
            onClick={toggleTheme}
            style={{
              backgroundColor: "var(--section-bg)",
              border: "2px solid var(--border-color)",
              color: "var(--accent-color)",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <HamburgerMenu />
        </div>
      </div>

      <div style={{ marginTop: "80px" }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center" style={{ color: "var(--text-primary)" }}>
              <h1 className="display-4 mb-4">Coding Races</h1>
              <p className="lead mb-4">
                Ready to test your coding speed? Compete against others in real-time coding challenges!
              </p>
              <div className="card mb-4" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <div className="card-body">
                  <h2 className="card-title mb-3">Race Format</h2>
                  <p className="card-text">
                    Coding races feature timed challenges where you'll solve programming problems 
                    against the clock and compete with other students for the fastest solution.
                  </p>
                  <button className="btn btn-primary" disabled>
                    Join Race (Coming Soon)
                  </button>
                </div>
              </div>
              <div className="alert alert-info" style={{
                backgroundColor: "var(--textarea-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <strong>Note:</strong> This feature is currently under development. 
                Get ready for exciting coding competitions!
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 