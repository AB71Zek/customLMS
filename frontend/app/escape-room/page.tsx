'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from '../Components/Footer';
import Header from '../Components/header';
import { useTheme } from '../Components/ThemeContext';

export default function EscapeRoom() {
  const { theme } = useTheme();

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", marginBottom: "60px" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ marginTop: "133px" }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center" style={{ color: "var(--text-primary)" }}>
              <h1 className="display-4 mb-4">Escape Room</h1>
              <p className="lead mb-4">
                Welcome to the Escape Room challenge! Test your problem-solving skills and see if you can escape before time runs out.
              </p>
              <div className="card mb-4" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <div className="card-body">
                  <h2 className="card-title mb-3">Challenge Overview</h2>
                  <p className="card-text">
                    This escape room features multiple puzzles, hidden clues, and interactive elements. 
                    Work through each challenge systematically to find your way out.
                  </p>
                  <button className="btn btn-primary" disabled>
                    Start Challenge (Coming Soon)
                  </button>
                </div>
              </div>
              <div className="alert alert-info" style={{
                backgroundColor: "var(--textarea-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <strong>Note:</strong> This feature is currently under development. 
                Check back soon for the full escape room experience!
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 