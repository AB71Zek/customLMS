'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { } from 'react';
import Header from '../../Components/header';
import { useTheme } from '../../Components/ThemeContext';

export default function MapRoomPage() {
  const { theme } = useTheme();

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", display: 'flex', flexDirection: 'column' }} data-theme={theme}>
      <Header studentNumber="21406232" />
      <div style={{ marginTop: "140px", marginBottom: "20px", flex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Aspect-ratio container to avoid cropping */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth: '1600px',
            maxHeight: '675px',
            aspectRatio: '16 / 9',
            backgroundImage: "url('/escape-room-misc/treasure-map.png')",
            backgroundSize: '89.8vw 89.6vh',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '3px solid var(--border-color)',
            borderRadius: '8px'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
          </div>
          <div className="d-flex justify-content-between align-items-center" style={{ position: 'absolute', top: 0, left: 1150, right: 0, padding: '12px 16px', zIndex: 1 }}>
            <span className="badge" style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '16px', padding: '9px 12px', borderRadius: '14px', border: '2px solid black'}}>Timer paused</span>
          </div>
        </div>
      </div>
    </div>
  );
}


