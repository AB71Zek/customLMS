'use client';
import { useTheme } from './ThemeContext';
import HamburgerMenu from './hamburgerMenu';

interface HeaderProps {
  studentNumber: string;
}

const Header = ({ studentNumber }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Top Header */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--header-bg)",
        padding: "15px 20px",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid var(--border-color)"
      }} className="theme-transition">
        {/* Student Number on the left */}
        <div style={{
          backgroundColor: "var(--section-bg)",
          padding: "8px 15px",
          borderRadius: "20px",
          border: "2px solid var(--border-color)"
        }} className="theme-transition">
          <span style={{
            color: "var(--accent-color)",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            Student No: {studentNumber}
          </span>
        </div>

        {/* Center - MOODLE LMS Title */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001
        }}>
          <h1 style={{
            color: "var(--accent-color)",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            margin: 0,
            whiteSpace: "nowrap"
          }}>
            MOODLE LMS
          </h1>
        </div>

        {/* Right - Theme Toggle Button + Hamburger Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button 
            className="btn btn-outline-primary theme-transition theme-toggle-btn"
            onClick={toggleTheme}
            style={{
              backgroundColor: "var(--section-bg)",
              border: "2px solid var(--border-color)",
              color: "var(--accent-color)",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <HamburgerMenu />
        </div>
      </header>

      {/* Navigation Bar */}
      <nav style={{
        position: "fixed",
        top: "80px",
        left: 0,
        right: 0,
        backgroundColor: "var(--section-bg)",
        borderBottom: "2px solid var(--border-color)",
        zIndex: 999,
        padding: "10px 0"
      }} className="theme-transition">
        <div className="container">
          <ul style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: "40px"
          }}>
            <li>
              <a href="/" style={{
                color: "var(--text-primary)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "8px 16px",
                borderRadius: "20px",
                transition: "all 0.3s ease",
                border: "2px solid transparent"
              }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-color)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "transparent";
              }}>
                🏠 Home
              </a>
            </li>
            <li>
              <a href="/about" style={{
                color: "var(--text-primary)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "8px 16px",
                borderRadius: "20px",
                transition: "all 0.3s ease",
                border: "2px solid transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-color)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "transparent";
              }}>
                ℹ️ About
              </a>
            </li>
            <li>
              <a href="/escape-room" style={{
                color: "var(--text-primary)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "8px 16px",
                borderRadius: "20px",
                transition: "all 0.3s ease",
                border: "2px solid transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-color)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "transparent";
              }}>
                🚪 Escape Room
              </a>
            </li>
            <li>
              <a href="/coding-races" style={{
                color: "var(--text-primary)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "8px 16px",
                borderRadius: "20px",
                transition: "all 0.3s ease",
                border: "2px solid transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-color)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "transparent";
              }}>
                🏁 Coding Races
              </a>
            </li>
            <li>
              <a href="/court-room" style={{
                color: "var(--text-primary)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "8px 16px",
                borderRadius: "20px",
                transition: "all 0.3s ease",
                border: "2px solid transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-color)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "transparent";
              }}>
                ⚖️ Court Room
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;