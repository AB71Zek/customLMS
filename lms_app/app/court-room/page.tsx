'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Components/header";

export default function CourtRoom() {
  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", minHeight: "100vh" }}>
      <Header studentNumber="21406232" />
      <div style={{ marginTop: "80px" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center text-white">
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
    </div>
  );
} 