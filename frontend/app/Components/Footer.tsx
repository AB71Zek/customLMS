'use client';


export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: '#ecf0f1',
      textAlign: 'center',
      padding: '20px',
      marginTop: '50px',
      borderTop: '2px solid #34495e'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <p style={{
          margin: '0 0 10px 0',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>
          🏰 Custom Learning Management System
        </p>
        <p style={{
          margin: '0',
          fontSize: '0.9rem',
          color: '#bdc3c7'
        }}>
          Built with Next.js, React, and Bootstrap • OpenTelemetry Instrumentation
        </p>
        <div style={{
          marginTop: '15px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <a href="/about" style={{
            color: '#ecf0f1',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.3s ease'
          }}>
            About
          </a>
          <a href="/coding-races" style={{
            color: '#ecf0f1',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.3s ease'
          }}>
            Coding Races
          </a>
          <a href="/court-room" style={{
            color: '#ecf0f1',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.3s ease'
          }}>
            Court Room
          </a>
          <a href="/escape-room" style={{
            color: '#ecf0f1',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.3s ease',
            fontWeight: 'bold'
          }}>
            Escape Room
          </a>
        </div>
      </div>
    </footer>
  );
}
