'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import HamburgerMenu from '../Components/hamburgerMenu';

export default function CourtRoom() {
  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", minHeight: "100vh" }}>
      {/* Student Number Display */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "20px", 
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "8px 15px",
        borderRadius: "20px",
        border: "2px solid #007bff"
      }}>
        <span style={{ color: "#007bff", fontWeight: "bold", fontSize: "16px" }}>
          Student No: 21406232
        </span>
      </div>
      <br />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center text-white">
            <HamburgerMenu />
            <h1 className="display-4 mb-4">Court Room</h1>
            <div className="card bg-dark text-white border-secondary">
              <div className="card-body">
                <h2 className="card-title">⚖️ Court Room</h2>
                <p className="card-text">
                  Step into the virtual courtroom! Experience legal proceedings, debates, and 
                  argumentative exercises in an interactive learning environment.
                </p>
                <div className="alert alert-info">
                  <strong>🚧 Under Construction</strong><br />
                  This page is currently being developed. Prepare for engaging legal simulations!
                </div>
                <div className="mt-4">
                  <button className="btn btn-primary me-2" disabled>Enter Court</button>
                  <button className="btn btn-secondary" disabled>View Cases</button>
                  <button className="btn btn-warning" disabled>Join Trial</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 