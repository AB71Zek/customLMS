'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer";
import Header from "../Components/header";
import { useTheme } from "../Components/ThemeContext";

export default function About() {
  const { theme } = useTheme();

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", marginBottom: "60px" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ marginTop: "133px" }}>
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
                  <div className="video-container" style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "800px",
                    margin: "20px auto",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                  }}>
                    <iframe
                      src="/Moodle LMS Front End.mp4"
                      title="Moodle LMS Front End Demo"
                      style={{
                        width: "100%",
                        height: "450px",
                        border: "none",
                        borderRadius: "10px"
                      }}
                      allowFullScreen
                    />
                  </div>
                  <div style={{ 
                    textAlign: "center", 
                    color: "var(--text-secondary)", 
                    fontSize: "14px", 
                    marginTop: "10px" 
                  }}>
                    <strong>Moodle LMS Front End Demo</strong> - Interactive demonstration of the learning management system features
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