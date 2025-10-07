'use client';
import { getCurrentRoom } from '../utils/keyCodeGenerator';

interface StartGameProps {
  timeLeft: number;
  isTimerPaused: boolean;
  roomSaved: boolean;
  onOpenEditor: () => void;
  onRestart: () => void;
  onClickTrophy?: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function StartGame({ timeLeft, isTimerPaused, roomSaved, onOpenEditor, onRestart, onClickTrophy }: StartGameProps) {
  const currentRoom = getCurrentRoom();
  
  return (
    <>
      {/* Overlay content: either instruction to open editor or trophy to start */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none' }}>
        {!roomSaved ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="alert" role="alert" style={{
              backgroundColor: '#fff8d1',
              color: '#dc3545',
              borderColor: '#ffe58f',
              fontWeight: 800,
              fontSize: '24px',
              letterSpacing: '0.3px',
              borderRadius: '10px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.25)'
            }}>
              Use the editor to create your escape room and start the game!
            </div>
            <button
              onClick={onOpenEditor}
              className="btn btn-outline-primary"
              style={{
                pointerEvents: 'auto',
                backgroundColor: '#00bcd4',
                color: '#fff',
                borderColor: '#000',
                borderWidth: '3px',
                borderStyle: 'solid',
                fontWeight: 600,
                padding: '10px 18px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                fontSize: '15px',
                letterSpacing: '0.4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00acc1';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00bcd4';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Open Icon Editor
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#fff8d1',
            border: '2px solid #ffe58f',
            borderRadius: '12px',
            padding: '16px 22px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'auto'
          }}>
            <div
              role="button"
              style={{
                width: '92px',
                height: '92px',
                backgroundImage: "url('/escape-room-misc/trophy.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))',
                transition: 'transform 0.15s ease, filter 0.15s ease'
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.06)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
              onClick={onClickTrophy}
            />
            <div style={{ fontWeight: 800, color: '#dc3545' }}>Click to Start!</div>
            {currentRoom && (
              <div style={{ 
                fontSize: '14px', 
                color: '#666', 
                fontWeight: 600,
                backgroundColor: 'rgba(255,255,255,0.8)',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #ddd'
              }}>
                Room Code: {currentRoom.roomCode}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top bar: editor + restart + timer */}
      <div className="d-flex align-items-center" style={{ position: 'absolute', top: 0, left: 1125, right: 0, padding: '12px 16px', zIndex: 20, gap: '10px', justifyContent: 'flex-end' }}>
        {roomSaved && (
          <>
            <button
              onClick={onOpenEditor}
              className="btn btn-outline-primary"
              disabled={roomSaved}
              style={{
                backgroundColor: roomSaved ? '#b2ebf2' : '#00bcd4',
                color: '#fff',
                borderColor: '#000',
                borderWidth: '2px',
                borderStyle: 'solid',
                fontWeight: 600,
                padding: '8px 12px',
                borderRadius: '14px',
                fontSize: '14px',
                minWidth: '160px',
                textAlign: 'center',
                opacity: roomSaved ? 0.6 : 1,
                cursor: roomSaved ? 'not-allowed' : 'pointer'
              }}
            >
              Open Icon Editor
            </button>
            <button
              onClick={onRestart}
              className="btn btn-outline-secondary"
              style={{
                backgroundColor: '#ffffff',
                color: '#000',
                borderColor: 'var(--border-color)',
                borderWidth: '2px',
                padding: '6px 10px',
                borderRadius: '14px',
                fontSize: '14px',
                minWidth: '120px',
                textAlign: 'center'
              }}
            >
              Restart Game
            </button>
          </>
        )}
        <span className="badge" style={{ 
          backgroundColor: isTimerPaused ? '#dc3545' : '#55e676', 
          color: 'white', 
          fontSize: '16px', 
          padding: '9px 12px', 
          borderRadius: '14px', 
          border: '2px solid black',
          minWidth: '160px',
          textAlign: 'center'
        }}>
          ⏱️ {formatTime(timeLeft)} {isTimerPaused ? '(paused)' : ''}
        </span>
      </div>
    </>
  );
}


