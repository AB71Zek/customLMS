'use client';

interface StageEndProps {
  onExit: () => void;
}

const StageEnd = ({ onExit }: StageEndProps) => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingBottom: '350px' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/escape-room-misc/stage-end-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', border: '3px solid var(--border-color)', borderRadius: '8px', boxSizing: 'border-box', pointerEvents: 'none' }} />
      <div style={{ textAlign: 'center', padding: '0 150px', position: 'relative' }}>
        <div style={{
          color: '#ffd400',
          fontWeight: 900,
          fontSize: 'clamp(26px, 3.2vw, 48px)',
          textShadow: '2px 2px 6px rgba(0,0,0,0.7)'
        }}>
          Congratulations! You found the treasure 💰💰
        </div>
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={onExit}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffd400'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-color)'; e.currentTarget.style.color = '#fff'; }}
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-color)',
              color: '#fff',
              border: '3px solid var(--border-color)',
              fontWeight: 800,
              letterSpacing: '0.3px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.35)'
            }}
          >
            Exit Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default StageEnd;


