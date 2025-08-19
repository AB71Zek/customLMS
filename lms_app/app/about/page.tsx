'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer";
import HamburgerMenu from "../Components/hamburgerMenu";

export default function About() {
  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", minHeight: "100vh", marginBottom: "100px" }}>
      {/* Top Bar - Student Number, Title, Toggle Button, Hamburger Menu */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        padding: "15px 20px",
        zIndex: 1001,
                       borderBottom: "2px solid #dc3545",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Left - Student Number */}
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "8px 15px",
          borderRadius: "20px",
                           border: "2px solid #dc3545"
        }}>
          <span style={{
            color: "#dc3545",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            Student No: 21406232
          </span>
        </div>

        {/* Center - MOODLE LMS Title */}
        <div>
          <h1 style={{
            color: "#dc3545",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            margin: 0
          }}>
            MOODLE LMS
          </h1>
        </div>

        {/* Right - Light/Dark Mode Toggle Button + Hamburger Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            className="btn btn-outline-primary"
            style={{
              borderColor: "#dc3545",
              color: "#dc3545",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            🌙 Dark
          </button>
          <HamburgerMenu />
        </div>
      </div>

      <div style={{ marginTop: "80px" }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center text-white">
              <h1 className="display-4 mb-4">About</h1>

              {/* Student Information */}
              <div className="card bg-dark text-white border-secondary mb-4">
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
              <div className="card bg-dark text-white border-secondary">
                <div className="card-body">
                  <h2 className="card-title mb-3">Video Presentation</h2>
                  <div className="video-placeholder" style={{
                    backgroundColor: "#333",
                    border: "2px dashed #dc3545",
                    borderRadius: "10px",
                    padding: "60px 20px",
                    margin: "20px 0"
                  }}>
                    <div style={{ color: "#dc3545", fontSize: "18px" }}>
                      <i className="fas fa-video" style={{ marginRight: "10px" }}></i>
                      Video will be displayed here
                    </div>
                    <div style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
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