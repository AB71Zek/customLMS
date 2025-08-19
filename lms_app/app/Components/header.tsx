'use client';
import HamburgerMenu from './hamburgerMenu';

interface HeaderProps {
  studentNumber: string;
}

const Header = ({ studentNumber }: HeaderProps) => {
  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      padding: "15px 20px",
      zIndex: 1000,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #007bff"
    }}>
      {/* Student Number on the left */}
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "8px 15px",
        borderRadius: "20px",
        border: "2px solid #007bff"
      }}>
        <span style={{ 
          color: "#ffffff", 
          fontWeight: "bold", 
          fontSize: "16px" 
        }}>
          Student No: {studentNumber}
        </span>
      </div>

      {/* Hamburger Menu on the right */}
      <div style={{ marginLeft: "auto" }}>
        <HamburgerMenu />
      </div>
    </header>
  );
};

export default Header;