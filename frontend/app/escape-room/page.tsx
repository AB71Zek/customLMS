'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Header from '../Components/header';
import { useTheme } from '../Components/ThemeContext';
import CombinedEditor from './editor/CombinedEditor';
import { generatePlayLink, generateShareText } from './linkGenerator';
import GameRoom from './stages/GameRoom';
import Stage from './stages/Stage';

export default function EscapeRoomEditor() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EscapeRoomEditorContent />
    </Suspense>
  );
}

function EscapeRoomEditorContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  // View state (map, combined editor, timer selection, join room, room saved, game room, gameplay)
  const [stageView, setStageView] = useState<'none' | 'combined-editor' | 'join-room' | 'room-saved' | 'game-room' | 'gameplay'>('none');
  const [roomId, setRoomId] = useState<string>('');
  const [savedRoomId, setSavedRoomId] = useState<string>('');
  const [currentGameRoomCode, setCurrentGameRoomCode] = useState<string>('');

  // Handle URL parameter for direct room access
  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam && roomParam.length === 8) {
      setRoomId(roomParam);
      setCurrentGameRoomCode(roomParam);
      setStageView('game-room');
    }
  }, [searchParams]);






  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ padding: "150px 20px 20px 20px", minHeight: "calc(100vh - 80px)" }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Aspect-ratio container to avoid cropping */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1600px',
            height: '600px',
            backgroundImage: "url('/escape-room-misc/treasure-map.png')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '3px solid var(--border-color)',
            borderRadius: '8px'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
          </div>
          {stageView === 'combined-editor' && (
            <CombinedEditor
              onComplete={(roomId) => { 
                setSavedRoomId(roomId);
                setStageView('room-saved');
              }}
              onCancel={() => setStageView('none')}
            />
          )}
          
          {/* Join Room Popup */}
          {stageView === 'join-room' && (
            <>
              {/* Background blur overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: '3px',
                  right: '3px',
                  bottom: '3px',
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 15,
                  borderRadius: '5px'
                }}
              />
              
              {/* Join Room Modal */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  maxWidth: '500px',
                  background: '#ffffff',
                  border: '3px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '32px',
                  zIndex: 16,
                  boxShadow: '0 16px 32px rgba(0,0,0,0.4)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h2 style={{ 
                    fontWeight: 800, 
                    fontSize: '24px', 
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Join a Room
                  </h2>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#666',
                    margin: 0
                  }}>
                    Enter the room code to join an escape room
                  </p>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter room code (e.g., ABC123)"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 600,
                      textAlign: 'center',
                      letterSpacing: '2px',
                      textTransform: 'uppercase'
                    }}
                    maxLength={6}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <button
                    onClick={() => {
                      setRoomId('');
                      setStageView('none');
                    }}
                    className="btn btn-outline-secondary"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000',
                      borderColor: 'var(--border-color)',
                      borderWidth: '2px',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 600,
                      minWidth: '120px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#6c757d';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (roomId.trim().length === 8) {
                        setCurrentGameRoomCode(roomId);
                        setRoomId('');
                        setStageView('game-room');
                      } else {
                        alert('Please enter a valid 8-character room code');
                      }
                    }}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      borderColor: '#28a745',
                      borderWidth: '2px',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 600,
                      minWidth: '120px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#218838';
                      e.currentTarget.style.borderColor = '#1e7e34';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#28a745';
                      e.currentTarget.style.borderColor = '#28a745';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}
          
          {/* Room Saved Success Popup */}
          {stageView === 'room-saved' && (
            <>
              {/* Background blur overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: '3px',
                  right: '3px',
                  bottom: '3px',
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 15,
                  borderRadius: '5px'
                }}
              />
              
              {/* Success Modal */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  maxWidth: '500px',
                  background: '#ffffff',
                  border: '3px solid #28a745',
                  borderRadius: '16px',
                  padding: '32px',
                  zIndex: 16,
                  boxShadow: '0 16px 32px rgba(0,0,0,0.4)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ 
                    fontSize: '48px', 
                    marginBottom: '16px',
                    color: '#28a745'
                  }}>
                    ✅
                  </div>
                  <h2 style={{ 
                  fontWeight: 800,
                  fontSize: '24px',
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    Room Saved Successfully!
                  </h2>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#666',
                    margin: 0
                  }}>
                    Your escape room has been created and saved
                  </p>
                </div>
                
                <div style={{ 
                  marginBottom: '24px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <label style={{ 
                    fontWeight: 600, 
                    fontSize: '14px', 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#666'
                  }}>
                    Room Code
                  </label>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#28a745',
                    letterSpacing: '3px',
                    fontFamily: 'monospace',
                    backgroundColor: '#ffffff',
                    border: '2px solid #28a745',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    display: 'inline-block',
                    marginBottom: '16px'
                  }}>
                    {savedRoomId}
                  </div>
                  
                  <label style={{ 
                    fontWeight: 600, 
                    fontSize: '14px', 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#666'
                  }}>
                    Shareable Link
                  </label>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#007bff',
                    backgroundColor: '#ffffff',
                    border: '2px solid #007bff',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'inline-block',
                    wordBreak: 'break-all',
                    maxWidth: '100%'
                  }}>
                    {generatePlayLink(savedRoomId)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <button
                    onClick={() => {
                      setStageView('none');
                    }}
                    className="btn btn-outline-secondary"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000',
                      borderColor: 'var(--border-color)',
                      borderWidth: '2px',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 600,
                      minWidth: '140px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#6c757d';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Back to Map
                  </button>
                <button
                    onClick={() => {
                      const shareText = generateShareText(savedRoomId);
                      navigator.clipboard.writeText(shareText).then(() => {
                        alert('Shareable content copied to clipboard!');
                      }).catch(() => {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = shareText;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Shareable content copied to clipboard!');
                      });
                    }}
                    className="btn btn-primary"
                  style={{
                      backgroundColor: '#007bff',
                    color: '#fff',
                      borderColor: '#007bff',
                      borderWidth: '2px',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                    fontWeight: 600,
                      minWidth: '140px',
                      transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0056b3';
                      e.currentTarget.style.borderColor = '#004085';
                      e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#007bff';
                      e.currentTarget.style.borderColor = '#007bff';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                    Copy Share Link
                </button>
              </div>
            </div>
            </>
          )}
          
          {/* Game Room Story */}
          {stageView === 'game-room' && (
            <Stage onEnterRoom={() => {
              setStageView('gameplay');
            }} />
          )}
          
          {/* Gameplay */}
          {stageView === 'gameplay' && (
            <GameRoom 
              roomCode={currentGameRoomCode || roomId} 
              onComplete={() => {
                setStageView('none');
                setCurrentGameRoomCode('');
              }} 
            />
          )}
          
          {/* Map buttons - only visible on map screen */}
          {stageView === 'none' && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              {/* Escape Room Editor Text */}
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                borderStyle: 'groove',
                borderWidth: '4px',
                borderColor: theme === 'light' ? '#EBB800' : '#EBB800',
                color: theme === 'light' ? '#EBB800' : '#EBB800',
                padding: '6px 20px',
                borderRadius: '18px',
                backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.25)',
                margin: '0 0 20px 0',
                textAlign: 'center',
                textShadow: theme === 'light' ? '2px 2px 4px rgba(0,0,0,0.8)' : '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                ESCAPE ROOM EDITOR
              </div>
              
              <button
                onClick={() => setStageView('combined-editor')}
                className="btn btn-outline-primary"
                style={{
                  backgroundColor: '#EBB800',
                  color: '#fff',
                  borderColor: '#000',
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  fontWeight: 800,
                  padding: '14px 24px',
                  borderRadius: '14px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                  fontSize: '20px',
                  letterSpacing: '0.8px',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8910F';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#EBB800';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Create Escape Room
              </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
} 


