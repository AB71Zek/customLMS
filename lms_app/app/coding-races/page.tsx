'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from '../Components/Footer';
import HamburgerMenu from '../Components/hamburgerMenu';

export default function CodingRaces() {
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
              <h1 className="display-4 mb-4">Coding Races</h1>
              <p className="lead mb-4">
                Ready to test your coding speed? Compete against others in real-time coding challenges!
              </p>
              <div className="card bg-dark text-white border-secondary mb-4">
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
              <div className="alert alert-info">
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