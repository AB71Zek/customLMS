'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../Components/header';
import { useTheme } from '../../Components/ThemeContext';
import IconEditor from '../editor/IconEditor';
import QuestionCreator from '../editor/QuestionCreator';
import QuestionEditor from '../editor/QuestionEditor';

export default function MapRoomPage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  // Get timer value from URL parameters
  const timerValue = parseInt(searchParams.get('timer') || '600');
  
  // View state (map, question editor, editor canvas, question creator, join room, room saved)
  const [stageView, setStageView] = useState<'none' | 'questions' | 'editor' | 'question-creator' | 'join-room' | 'room-saved'>('none');
  const [editorStageIndex, setEditorStageIndex] = useState<number>(0);
  const [roomExists, setRoomExists] = useState<boolean>(false);
  const [roomSaved, setRoomSaved] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('');
  const [savedRoomCode, setSavedRoomCode] = useState<string>('');

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(timerValue);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(true);

  // Load room existence on mount
  useEffect(() => {
    try {
      setRoomExists(localStorage.getItem('escape-room:room:exists') === 'true');
      setRoomSaved(localStorage.getItem('escape-room:room:saved') === 'true');
    } catch {}
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && !isTimerPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, isTimerPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Treasure Room position and icon
  const stage4Position = { left: '76%', top: '61%' };
  const stage4Icon = '/escape-room-misc/trophy.png';

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
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '3px solid var(--border-color)',
            borderRadius: '8px'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
            
            {/* Timer display - only visible on map screen */}
            {stageView === 'none' && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
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
            )}
          </div>
          {stageView === 'questions' && (
            <QuestionEditor stageIndex={editorStageIndex} onClose={() => setStageView('none')} />
          )}
          {stageView === 'editor' && (
            <IconEditor
              onSave={() => { setStageView('none'); setRoomExists(true); }}
              onCancel={() => setStageView('none')}
              onStep2={() => setStageView('question-creator')}
            />
          )}
          {stageView === 'question-creator' && (
            <QuestionCreator
              onComplete={(roomCode) => { 
                setSavedRoomCode(roomCode);
                setStageView('room-saved');
                setRoomExists(true);
                setRoomSaved(true);
              }}
              onBack={() => setStageView('editor')}
            />
          )}
          
          {/* Join Room Popup */}
          {stageView === 'join-room' && (
            <>
              {/* Background blur overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 15
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
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
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
                      setRoomCode('');
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
                      if (roomCode.trim().length === 6) {
                        // TODO: Implement room joining logic
                        console.log('Joining room:', roomCode);
                        // For now, just close the popup
                        setRoomCode('');
                        setStageView('none');
                      } else {
                        alert('Please enter a valid 6-character room code');
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
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 15
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
                    display: 'inline-block'
                  }}>
                    {savedRoomCode}
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
                      navigator.clipboard.writeText(savedRoomCode).then(() => {
                        alert('Room code copied to clipboard!');
                      }).catch(() => {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = savedRoomCode;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Room code copied to clipboard!');
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
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </>
          )}
          
          {/* Map buttons - only visible on map screen */}
          {stageView === 'none' && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setStageView('editor')}
                className="btn btn-outline-primary"
                style={{
                  backgroundColor: '#00bcd4',
                  color: '#fff',
                  borderColor: '#000',
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  fontWeight: 700,
                  padding: '16px 28px',
                  borderRadius: '14px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                  fontSize: '18px',
                  letterSpacing: '0.8px',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00acc1';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00bcd4';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Create Room
              </button>
              
              <div style={{ 
                fontStyle: 'italic', 
                color: '#FFD700', 
                fontWeight: 800, 
                fontSize: '18px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '4px 12px',
                borderRadius: '8px',
                border: '2px solid #FFD700'
              }}>
                OR
              </div>
              
              <button
                onClick={() => setStageView('join-room')}
                className="btn btn-outline-secondary"
                style={{
                  backgroundColor: '#DAA520',
                  color: '#fff',
                  borderColor: '#000',
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  fontWeight: 700,
                  padding: '16px 28px',
                  borderRadius: '14px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                  fontSize: '18px',
                  letterSpacing: '0.8px',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8860B';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DAA520';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Join a Room
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


