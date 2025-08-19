'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from '../Components/Footer';
import Header from '../Components/header';

export default function CodingRaces() {
  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", minHeight: "100vh", marginBottom: "100px" }}>
      {/* Top Bar - Student Number, Title, Toggle Button */}
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

        {/* Right - Light/Dark Mode Toggle Button */}
        <div>
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
        </div>
      </div>

      <Header />
      <div style={{ marginTop: "140px" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center text-white">
            <h1 className="display-4 mb-4">Coding Races</h1>
            <div className="card bg-dark text-white border-secondary">
              <div className="card-body">
                <h2 className="card-title">🏁 Coding Races</h2>
                <p className="card-text">
                  Compete against other developers in real-time coding challenges! Test your skills, 
                  solve problems, and climb the leaderboard.
                </p>
                <div className="alert alert-info">
                  <strong>🚧 Under Construction</strong><br />
                  This page is currently being developed. Get ready for exciting coding competitions!
                </div>
                <div className="mt-4">
                  <button className="btn btn-primary me-2" disabled>Join Race</button>
                  <button className="btn btn-secondary" disabled>View Challenges</button>
                  <button className="btn btn-info" disabled>Leaderboard</button>
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