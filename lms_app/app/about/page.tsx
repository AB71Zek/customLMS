'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer";
import HamburgerMenu from "../Components/hamburgerMenu";
import { useTheme } from "../Components/ThemeContext";

export default function About() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container theme-transition" style={{ backgroundColor: "var(--background)", padding: "0", minHeight: "100vh", marginBottom: "100px" }} data-theme={theme}>
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
          zIndex: 1002
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginRight: "30px" }}>
          <button 
            className="btn btn-outline-primary theme-transition"
            onClick={toggleTheme}
            style={{
              borderColor: "var(--accent-color)",
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
              <h1 className="display-4 mb-4">About</h1>

              {/* Student Information */}
              <div className="card mb-4" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <div className="card-body">
                  <h2 className="card-title mb-3">Student Information</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="card-text">
                        <strong>Name:</strong> Arunjot Babra
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text">
                        <strong>Student Number:</strong> 21406232
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Section */}
              <div className="card" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <div className="card-body">
                  <h2 className="card-title mb-3">Video Presentation</h2>
                  <div className="video-placeholder" style={{
                    backgroundColor: "var(--textarea-bg)",
                    border: "2px dashed var(--border-color)",
                    borderRadius: "10px",
                    padding: "60px 20px",
                    margin: "20px 0"
                  }}>
                    <div style={{ color: "var(--accent-color)", fontSize: "18px" }}>
                      <i className="fas fa-video" style={{ marginRight: "10px" }}></i>
                      Video will be displayed here
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "10px" }}>
                      (Video placeholder - you can add your video later)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 