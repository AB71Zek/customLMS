'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from '../Components/header';
import { useTheme } from '../Components/ThemeContext';

export default function CourtRoom() {
  const { theme } = useTheme();

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", marginBottom: "60px" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ marginTop: "133px" }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center" style={{ color: "var(--text-primary)" }}>
              <h1 className="display-4 mb-4">Court Room</h1>
              <p className="lead mb-4">
                Step into the virtual courtroom and experience interactive legal scenarios and debates!
              </p>
              <div className="card mb-4" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
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
              <div className="alert alert-info" style={{
                backgroundColor: "var(--textarea-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <strong>Note:</strong> This feature is currently under development. 
                Prepare for engaging legal simulations!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 