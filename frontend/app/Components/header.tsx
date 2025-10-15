'use client';

import { useState } from 'react';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  studentNumber: string;
}

export default function Header({ studentNumber }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme === 'light' ? '#ffffff' : '#2c3e50',
      borderBottom: `2px solid ${theme === 'light' ? '#e9ecef' : '#34495e'}`,
      zIndex: 1000,
      padding: '10px 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
            fontWeight: 'bold'
          }}>
            🏰 Custom LMS
          </h1>
          <span style={{
            fontSize: '0.9rem',
            color: theme === 'light' ? '#7f8c8d' : '#bdc3c7',
            backgroundColor: theme === 'light' ? '#f8f9fa' : '#34495e',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            Student: {studentNumber}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${theme === 'light' ? '#2c3e50' : '#ecf0f1'}`,
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'light' ? '#2c3e50' : '#ecf0f1';
              e.currentTarget.style.color = theme === 'light' ? '#ffffff' : '#2c3e50';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme === 'light' ? '#2c3e50' : '#ecf0f1';
            }}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
              padding: '5px'
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '20px',
          backgroundColor: theme === 'light' ? '#ffffff' : '#2c3e50',
          border: `1px solid ${theme === 'light' ? '#e9ecef' : '#34495e'}`,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '15px',
          minWidth: '200px',
          zIndex: 1001
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <a href="/about" style={{
              color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease'
            }}>
              About
            </a>
            <a href="/coding-races" style={{
              color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease'
            }}>
              Coding Races
            </a>
            <a href="/court-room" style={{
              color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease'
            }}>
              Court Room
            </a>
            <a href="/escape-room" style={{
              color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: theme === 'light' ? '#e3f2fd' : '#1a252f',
              fontWeight: 'bold'
            }}>
              Escape Room
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
