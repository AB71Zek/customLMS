'use client';
import HamburgerMenu from './hamburgerMenu';

// New header component - positioned below top bar
export default function Header() {
  return (
    <header style={{
      position: "fixed",
      top: "60px", // Positioned below the top bar
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      padding: "15px 20px",
      zIndex: 1000,
                   borderBottom: "2px solid #dc3545"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Left side - Action Button */}
        <div>
          <button 
            className="btn btn-primary"
            style={{
              backgroundColor: "#007bff",
              borderColor: "#007bff",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            Action
          </button>
        </div>

        {/* Right side - Hamburger Menu */}
        <div>
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}