'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';
import HamburgerMenu from './hamburgerMenu';

interface HeaderProps {
  studentNumber: string;
}

const Header = ({ studentNumber }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isActivePage = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Header */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--text-tertiary)",
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
            color: "var(--accent-color-tertiary)",
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
        top: "76px",
        left: 0,
        right: 0,
        backgroundColor: "var(--section-bg)",
        borderBottom: "2px solid var(--border-color)",
        zIndex: 999,
        padding: "5px 0"
      }} className="theme-transition">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          {/* Home */}
          <Link href="/" style={{
            color: isActivePage('/') ? "white" : "var(--text-primary)",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "6px 14px",
            borderRadius: "18px",
            transition: "all 0.3s ease",
            backgroundColor: isActivePage('/') ? "var(--accent-color)" : "transparent",
            border: isActivePage('/') ? "2px solid var(--accent-color)" : "2px solid transparent",
            minWidth: "120px",
            textAlign: "center"
          }} 
          onMouseEnter={(e) => {
            if (!isActivePage('/')) {
              e.currentTarget.style.backgroundColor = "none";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--accent-color)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActivePage('/')) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}>
            HOME
          </Link>

          {/* Divider */}
          <div style={{
            width: "2px",
            height: "20px",
            backgroundColor: "var(--border-color)",
            borderRadius: "1px"
          }}></div>

          {/* About */}
          <Link href="/about" style={{
            color: isActivePage('/about') ? "white" : "var(--text-primary)",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "6px 14px",
            borderRadius: "18px",
            transition: "all 0.3s ease",
            backgroundColor: isActivePage('/about') ? "var(--accent-color)" : "transparent",
            border: isActivePage('/about') ? "2px solid var(--accent-color)" : "2px solid transparent",
            minWidth: "120px",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            if (!isActivePage('/about')) {
              e.currentTarget.style.backgroundColor = "none";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--accent-color)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActivePage('/about')) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}>
            ABOUT
          </Link>

          {/* Divider */}
          <div style={{
            width: "2px",
            height: "20px",
            backgroundColor: "var(--border-color)",
            borderRadius: "1px"
          }}></div>

          {/* Escape Room */}
          <Link href="/escape-room" style={{
            color: isActivePage('/escape-room') ? "white" : "var(--text-primary)",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "6px 14px",
            borderRadius: "18px",
            transition: "all 0.3s ease",
            backgroundColor: isActivePage('/escape-room') ? "var(--accent-color)" : "transparent",
            border: isActivePage('/escape-room') ? "2px solid var(--accent-color)" : "2px solid transparent",
            minWidth: "120px",
            textAlign: "center"
            }}
          onMouseEnter={(e) => {
            if (!isActivePage('/escape-room')) {
              e.currentTarget.style.backgroundColor = "none";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--accent-color)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActivePage('/escape-room')) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}>
            ESCAPE ROOM
          </Link>

          {/* Divider */}
          <div style={{
            width: "2px",
            height: "20px",
            backgroundColor: "var(--border-color)",
            borderRadius: "1px"
          }}></div>

          {/* Coding Races */}
          <Link href="/coding-races" style={{
            color: isActivePage('/coding-races') ? "white" : "var(--text-primary)",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "6px 14px",
            borderRadius: "18px",
            transition: "all 0.3s ease",
            backgroundColor: isActivePage('/coding-races') ? "var(--accent-color)" : "transparent",
            border: isActivePage('/coding-races') ? "2px solid var(--accent-color)" : "2px solid transparent",
            minWidth: "120px",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            if (!isActivePage('/coding-races')) {
              e.currentTarget.style.backgroundColor = "none";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--accent-color)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActivePage('/coding-races')) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}>
            CODING RACES
          </Link>

          {/* Divider */}
          <div style={{
            width: "2px",
            height: "20px",
            backgroundColor: "var(--border-color)",
            borderRadius: "1px"
          }}></div>

          {/* Court Room */}
          <Link href="/court-room" style={{
            color: isActivePage('/court-room') ? "white" : "var(--text-primary)",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "6px 14px",
            borderRadius: "18px",
            transition: "all 0.3s ease",
            backgroundColor: isActivePage('/court-room') ? "var(--accent-color)" : "transparent",
            border: isActivePage('/court-room') ? "2px solid var(--accent-color)" : "2px solid transparent",
            minWidth: "120px",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            if (!isActivePage('/court-room')) {
              e.currentTarget.style.backgroundColor = "none";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--accent-color)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActivePage('/court-room')) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}>
            COURT ROOM
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;