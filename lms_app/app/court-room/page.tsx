'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from '../Components/Footer';
import HamburgerMenu from '../Components/hamburgerMenu';

export default function CourtRoom() {
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
        borderBottom: "2px solid #007bff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Left - Student Number */}
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "8px 15px",
          borderRadius: "20px",
          border: "2px solid #007bff"
        }}>
          <span style={{
            color: "#007bff",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            Student No: 21406232
          </span>
        </div>

        {/* Center - MOODLE LMS Title */}
        <div>
          <h1 style={{
            color: "#007bff",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            margin: 0
          }}>
            MOODLE LMS
          </h1>
        </div>

        {/* Right - Light/Dark Mode Toggle Button + Hamburger Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button 
            className="btn btn-outline-primary"
            style={{
              borderColor: "#007bff",
              color: "#007bff",
              padding: "10px 20px",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            🌙 Dark Mode
          </button>
          <HamburgerMenu />
        </div>
      </div>

      <div style={{ marginTop: "80px" }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center text-white">
              <h1 className="display-4 mb-4">Court Room</h1>
              <p className="lead mb-4">
                Step into the virtual courtroom and experience interactive legal scenarios and debates!
              </p>
              <div className="card bg-dark text-white border-secondary mb-4">
                <div className="card-body">
                  <h2 className="card-title mb-3">Courtroom Experience</h2>
                  <p className="card-text">
                    The virtual courtroom provides realistic legal scenarios where you can practice 
                    argumentation, evidence presentation, and legal reasoning skills.
                  </p>
                  <button className="btn btn-primary" disabled>
                    Enter Courtroom (Coming Soon)
                  </button>
                </div>
              </div>
              <div className="alert alert-info">
                <strong>Note:</strong> This feature is currently under development. 
                Prepare for engaging legal simulations!
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 