'use client';
import { useTheme } from '../../Components/ThemeContext';

interface StageEndProps {
  onExit: () => void;
}

const StageEnd = ({ onExit }: StageEndProps) => {
  const { theme } = useTheme();

  return (
    <div
      className="theme-transition"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/escape-room-misc/stage-end-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 10,
        border: '3px solid var(--border-color)',
        borderRadius: '8px',
        backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)',
      }}
      data-theme={theme}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        color: '#ffd400',
        fontWeight: 800,
        fontSize: 'clamp(24px, 4vw, 48px)',
        textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
        marginBottom: '40px'
      }}>
        Congratulations! You found the treasure!
      </div>
      <button
        onClick={onExit}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffd400'; e.currentTarget.style.color = '#000'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-color)'; e.currentTarget.style.color = '#fff'; }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-color)',
          color: '#fff',
          border: '3px solid var(--border-color)',
          fontWeight: 700,
          letterSpacing: '0.5px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
        }}
      >
        Exit Room
      </button>
    </div>
  );
};

export default StageEnd;