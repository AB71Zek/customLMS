'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import HamburgerMenu from '../Components/hamburgerMenu';

export default function EscapeRoom() {
  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", minHeight: "100vh" }}>
      <br />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center text-white">
            <HamburgerMenu />
            <h1 className="display-4 mb-4">Escape Room</h1>
            <div className="card bg-dark text-white border-secondary">
              <div className="card-body">
                <h2 className="card-title">🚪 Escape Room Challenge</h2>
                <p className="card-text">
                  Welcome to the Escape Room! This interactive learning experience is designed to 
                  test your problem-solving skills and knowledge.
                </p>
                <div className="alert alert-info">
                  <strong>🚧 Under Construction</strong><br />
                  This page is currently being developed. Check back soon for exciting escape room challenges!
                </div>
                <div className="mt-4">
                  <button className="btn btn-primary me-2" disabled>Start Challenge</button>
                  <button className="btn btn-secondary" disabled>View Leaderboard</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 