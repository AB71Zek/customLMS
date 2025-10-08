'use client';

interface StageProps {
  onEnterRoom: () => void;
}

export default function Stage({ onEnterRoom }: StageProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/escape-room-misc/stage4-bg.png')",
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 10,
        border: '3px solid var(--border-color)',
        borderRadius: '8px'
      }}
    >
      {/* Story overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'rgba(0,0,0,0.3)', 
        zIndex: 11
      }}>
        {/* Complete story text */}
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '1000px',
          textAlign: 'center',
          padding: '0 20px'
        }}>
          <p style={{
            fontSize: '28px',
            color: '#FFE4B5',
            margin: '0 0 20px 0',
            lineHeight: '1.4',
            fontWeight: 700
          }}>
            After exploring a dense forest, you finally see the cave.
          </p>
          
          <p style={{
            fontSize: '26px',
            color: '#FFE4B5',
            margin: '0 0 20px 0',
            lineHeight: '1.4',
            fontWeight: 700
          }}>
            The treasure chest seems to be situated in a corner. But it has a reading on it.
          </p>
          
          <p style={{
            fontSize: '24px',
            color: '#FFE4B5',
            margin: '0 0 20px 0',
            lineHeight: '1.4',
            fontWeight: 700
          }}>
            You approach the chest and read the inscription:
          </p>
          
          <p style={{
            fontStyle: 'italic',
            fontSize: '22px',
            color: '#FFE4B5',
            fontWeight: 700,
            margin: '0 0 40px 0',
            lineHeight: '1.4'
          }}>
            "The hurdles lie outside the vessel, the treasure inside is earned. Open me if you are meant to be the righteous one....."
          </p>
        </div>

        {/* Enter Room button */}
        <button
          onClick={onEnterRoom}
          className="btn btn-success"
          style={{
            position: 'absolute',
            bottom: '50px',
            right: '50px',
            backgroundColor: '#DAA520',
            color: '#fff',
            borderColor: '#DAA520',
            borderWidth: '2px',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B8860B';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#DAA520';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
        >
          Enter Room
        </button>
      </div>
    </div>
  );
}
