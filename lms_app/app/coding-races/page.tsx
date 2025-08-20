'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from '../Components/Footer';
import Header from '../Components/header';
import { useTheme } from '../Components/ThemeContext';

export default function CodingRaces() {
  const { theme } = useTheme();

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", marginBottom: "100px" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ marginTop: "140px" }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center" style={{ color: "var(--text-primary)" }}>
              <h1 className="display-4 mb-4">Coding Races</h1>
              <p className="lead mb-4">
                Ready to test your coding speed? Compete against others in real-time coding challenges!
              </p>
              <div className="card mb-4" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
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
              <div className="alert alert-info" style={{
                backgroundColor: "var(--textarea-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
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