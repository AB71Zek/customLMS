'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer";
import Header from "../Components/header";
import { useTheme } from "../Components/ThemeContext";

export default function About() {
  const { theme } = useTheme();

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", marginBottom: "100px" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ marginTop: "140px" }}>
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