'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer";
import Header from "../Components/header";

export default function About() {
  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", minHeight: "100vh", marginBottom: "100px" }}>
      <Header studentNumber="21406232" />
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
                    border: "2px dashed #007bff",
                    borderRadius: "10px",
                    padding: "60px 20px",
                    margin: "20px 0"
                  }}>
                    <div style={{ color: "#007bff", fontSize: "18px" }}>
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