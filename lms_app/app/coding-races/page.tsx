'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import HamburgerMenu from '../Components/hamburgerMenu';

export default function CodingRaces() {
  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", minHeight: "100vh" }}>
      <br />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center text-white">
            <HamburgerMenu />
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
  );
} 