'use client';

import React, { useState, useEffect } from 'react';
import { trace } from '@opentelemetry/api';
import Header from '../Components/header';
import { ThemeContext } from '../Components/ThemeContext';
import CombinedEditor from './editor/CombinedEditor';
import Stage from './stages/Stage';
import GameRoom from './stages/GameRoom';
import { generatePlayLink } from './linkGenerator';

export default function EscapeRoomEditorContent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [stageView, setStageView] = useState<'none' | 'editor' | 'game-room' | 'gameplay'>('none');
  const [currentGameRoomCode, setCurrentGameRoomCode] = useState<string>('');
  const [gameTimerSeconds, setGameTimerSeconds] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [savedRoomId, setSavedRoomId] = useState<string>('');
  const [showJoinRoomPopup, setShowJoinRoomPopup] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [roomError, setRoomError] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    
    // Network status detection
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const validateRoomExists = async (roomCode: string) => {
    return await trace
      .getTracer('custom-lms-frontend')
      .startActiveSpan('validate-room-exists', async (span) => {
        try {
          setIsLoadingRoom(true);
          setRoomError('');
          
          const response = await fetch(`http://localhost:4000/api/play/${roomCode}`);
          
          if (response.ok) {
            span.setAttributes({
              'room.validation.success': true,
              'room.code': roomCode
            });
            setCurrentGameRoomCode(roomCode);
            setStageView('game-room');
            setShowJoinRoomPopup(false);
            setRoomId('');
            return true;
          } else {
            span.setStatus({ code: 2, message: 'Room not found' });
            setRoomError('Room not found. Please check the room code.');
            return false;
          }
        } catch (error) {
          span.setStatus({ code: 2, message: 'Network error' });
          setRoomError('Network error. Please check your connection.');
          console.error('Error validating room:', error);
          return false;
        } finally {
          setIsLoadingRoom(false);
          span.end();
        }
      });
  };

  const handleSaveRoom = async (roomData: any) => {
    return await trace
      .getTracer('custom-lms-frontend')
      .startActiveSpan('save-room', async (span) => {
        try {
          const response = await fetch('http://localhost:4000/api/rooms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
          });

          if (response.ok) {
            const savedRoom = await response.json();
            setSavedRoomId(savedRoom.roomId);
            
            span.setAttributes({
              'room.save.success': true,
              'room.id': savedRoom.roomId,
              'room.createdBy': savedRoom.createdBy
            });
            
            return savedRoom;
          } else {
            span.setStatus({ code: 2, message: 'Failed to save room' });
            throw new Error('Failed to save room');
          }
        } catch (error) {
          span.setStatus({ code: 2, message: 'Save room error' });
          console.error('Error saving room:', error);
          throw error;
        } finally {
          span.end();
        }
      });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="container theme-transition" style={{ backgroundColor: 'transparent', padding: "150px 20px 20px 20px", minHeight: "100vh" }} data-theme={theme}>
        <Header studentNumber="21406232" />

        {/* Network Status Indicator */}
        {isClient && !isOnline && (
          <div style={{
            position: 'fixed',
            top: '120px',
            right: '20px',
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            🔴 Offline - Some features may not work
          </div>
        )}

        {/* Main Content */}
        {stageView === 'none' && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#2c3e50' }}>
              🏰 Escape Room Editor
            </h1>
            
            <div style={{ marginBottom: '30px' }}>
              <button
                onClick={() => setStageView('editor')}
                className="btn btn-primary"
                style={{
                  fontSize: '1.2rem',
                  padding: '15px 30px',
                  backgroundColor: '#dc3545',
                  borderColor: '#000',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c82333';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
              >
                Create Escape Room
              </button>
            </div>

            <div>
              <button
                onClick={() => setShowJoinRoomPopup(true)}
                className="btn btn-outline-primary"
                style={{
                  fontSize: '1.1rem',
                  padding: '12px 25px',
                  borderColor: '#dc3545',
                  color: '#dc3545',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#dc3545';
                }}
              >
                Join Room
              </button>
            </div>
          </div>
        )}

        {/* Editor */}
        {stageView === 'editor' && (
          <CombinedEditor
            onSave={handleSaveRoom}
            onBack={() => setStageView('none')}
          />
        )}

        {/* Game Room Story */}
        {stageView === 'game-room' && (
          <Stage onEnterRoom={(timerSeconds: number) => {
            setGameTimerSeconds(timerSeconds);
            setStageView('gameplay');
          }} />
        )}

        {/* Gameplay */}
        {stageView === 'gameplay' && (
          <GameRoom
            roomCode={currentGameRoomCode || roomId}
            timerSeconds={gameTimerSeconds}
            onComplete={() => {
              setStageView('none');
              setCurrentGameRoomCode('');
              setGameTimerSeconds(0);
            }}
          />
        )}

        {/* Room Saved Successfully Popup */}
        {savedRoomId && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 1000,
            textAlign: 'center',
            minWidth: '400px'
          }}>
            <h3 style={{ color: '#28a745', marginBottom: '20px' }}>✅ Room Saved Successfully!</h3>
            <p style={{ marginBottom: '15px', fontSize: '16px' }}>
              <strong>Room Code:</strong> {savedRoomId}
            </p>
            <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
              Share this link with your students:
            </p>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => {
                  const playLink = generatePlayLink(savedRoomId);
                  navigator.clipboard.writeText(playLink).then(() => {
                    alert('Link copied to clipboard!');
                  }).catch(() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = playLink;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('Link copied to clipboard!');
                  });
                }}
                className="btn btn-primary"
                style={{
                  backgroundColor: '#007bff',
                  borderColor: '#007bff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Copy Play Link
              </button>
            </div>
            <button
              onClick={() => {
                setSavedRoomId('');
                setStageView('none');
              }}
              className="btn btn-secondary"
              style={{
                backgroundColor: '#6c757d',
                borderColor: '#6c757d',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              Back to Main Menu
            </button>
          </div>
        )}

        {/* Join Room Popup */}
        {showJoinRoomPopup && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 1000,
            textAlign: 'center',
            minWidth: '400px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Join Escape Room</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Enter the room code to start playing:
            </p>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room code..."
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '20px',
                textAlign: 'center'
              }}
            />
            {roomError && (
              <div style={{
                color: '#dc3545',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {roomError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => validateRoomExists(roomId)}
                disabled={!roomId || isLoadingRoom}
                className="btn btn-primary"
                style={{
                  backgroundColor: '#dc3545',
                  borderColor: '#dc3545',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: (!roomId || isLoadingRoom) ? 0.6 : 1
                }}
              >
                {isLoadingRoom ? 'Loading...' : 'Continue'}
              </button>
              <button
                onClick={() => {
                  setShowJoinRoomPopup(false);
                  setRoomId('');
                  setRoomError('');
                }}
                className="btn btn-secondary"
                style={{
                  backgroundColor: '#6c757d',
                  borderColor: '#6c757d',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </ThemeContext.Provider>
  );
}
