'use client';

import { trace } from '@opentelemetry/api';
import { useEffect, useState } from 'react';

interface PlacedItem {
  id: string;
  type: string;
  x: number;
  y: number;
}

interface Question {
  itemId: string;
  question: string;
  expectedAnswers: string[];
}

interface TempRoomData {
  roomId: string;
  iconLayout: PlacedItem[];
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

interface GameRoomProps {
  roomCode: string;
  onComplete: () => void;
  timerSeconds?: number;
}

export default function GameRoom({ roomCode, onComplete, timerSeconds = 0 }: GameRoomProps) {
  const [roomData, setRoomData] = useState<TempRoomData | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set());
  const [keyCodes, setKeyCodes] = useState<Map<string, string>>(new Map());
  const [showChestModal, setShowChestModal] = useState(false);
  const [chestKeyCodes, setChestKeyCodes] = useState<string[]>([]);
  const [unlockedLocks, setUnlockedLocks] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number>(timerSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerRunning(false);
            onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning, timeLeft, onComplete]);

  useEffect(() => {
    if (timerSeconds > 0 && roomData) {
      setTimeLeft(timerSeconds);
      setIsTimerRunning(true);
    }
  }, [timerSeconds, roomData]);

  const loadRoomByCode = async (code: string): Promise<TempRoomData | null> => {
    return await trace
      .getTracer('custom-lms-frontend')
      .startActiveSpan('load-room-by-code', async (span) => {
        try {
          const response = await fetch(`http://localhost:4000/api/play/${code}`);
          
          if (!response.ok) {
            span.setStatus({ code: 2, message: 'Room not found' });
            throw new Error('Room not found');
          }

          const room = await response.json();
          
          const transformedRoom: TempRoomData = {
            roomId: room.roomId,
            iconLayout: room.iconLayout,
            questions: room.questions,
            createdAt: room.createdAt,
            createdBy: 'teacher' // Default value since API doesn't return this
          };

          span.setAttributes({
            'room.load.success': true,
            'room.id': room.roomId,
            'room.questionsCount': room.questions.length,
            'room.iconsCount': room.iconLayout.length
          });

          return transformedRoom;
        } catch (error) {
          span.setStatus({ code: 2, message: 'Failed to load room' });
          console.error('Error loading room:', error);
          throw error;
        } finally {
          span.end();
        }
      });
  };

  const loadRoom = async () => {
    try {
      const data = await loadRoomByCode(roomCode);
      if (data) {
        setRoomData(data);
        
        // Generate key codes for chest
        const nonChestItems = data.iconLayout.filter((item: PlacedItem) => item.type !== 'chest');
        const generatedKeyCodes = nonChestItems.map(() => 
          Math.random().toString(36).substring(2, 6).toUpperCase()
        );
        setChestKeyCodes(generatedKeyCodes);
      }
    } catch (error) {
      console.error('Failed to load room:', error);
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadRoom(), 1000);
      } else {
        setShowFeedback({
          type: 'error',
          message: 'Failed to load room. Please check the room code and try again.'
        });
      }
    }
  };

  useEffect(() => {
    if (roomCode) {
      loadRoom();
    }
  }, [roomCode, retryCount]);

  const handleItemClick = (item: PlacedItem) => {
    return trace
      .getTracer('custom-lms-frontend')
      .startActiveSpan('item-click', async (span) => {
        try {
          span.setAttributes({
            'item.id': item.id,
            'item.type': item.type,
            'item.position': `${item.x},${item.y}`
          });

          if (item.type === 'chest') {
            setShowChestModal(true);
          } else {
            const question = roomData?.questions.find(q => q.itemId === item.id);
            if (question) {
              setCurrentQuestion(question);
              setShowQuestionModal(true);
            }
          }
        } catch (error) {
          span.setStatus({ code: 2, message: 'Item click error' });
          console.error('Error handling item click:', error);
        } finally {
          span.end();
        }
      });
  };

  const handleAnswerSubmit = () => {
    if (!currentQuestion) return;

    return trace
      .getTracer('custom-lms-frontend')
      .startActiveSpan('answer-submit', async (span) => {
        try {
          const isCorrect = currentQuestion.expectedAnswers.some(expected => 
            userAnswer.toLowerCase().trim() === expected.toLowerCase().trim()
          );

          span.setAttributes({
            'question.id': currentQuestion.itemId,
            'answer.correct': isCorrect,
            'answer.length': userAnswer.length
          });

          if (isCorrect) {
            setUnlockedItems(prev => new Set([...prev, currentQuestion.itemId]));
            
            // Generate key code for this item
            const keyCode = Math.random().toString(36).substring(2, 6).toUpperCase();
            setKeyCodes(prev => new Map([...prev, [currentQuestion.itemId, keyCode]]));
            
            setShowFeedback({
              type: 'success',
              message: `Correct! Key code: ${keyCode}. This code might unlock something...`
            });
          } else {
            setShowFeedback({
              type: 'error',
              message: 'Incorrect answer. Try again!'
            });
          }

          setUserAnswer('');
          setShowQuestionModal(false);
        } catch (error) {
          span.setStatus({ code: 2, message: 'Answer submit error' });
          console.error('Error submitting answer:', error);
        } finally {
          span.end();
        }
      });
  };

  const handleChestKeySubmit = (lockIndex: number, keyCode: string) => {
    return trace
      .getTracer('custom-lms-frontend')
      .startActiveSpan('chest-key-submit', async (span) => {
        try {
          const correctKeyCode = chestKeyCodes[lockIndex];
          const isCorrect = keyCode.toUpperCase() === correctKeyCode;

          span.setAttributes({
            'chest.lockIndex': lockIndex,
            'chest.keyCorrect': isCorrect,
            'chest.totalLocks': chestKeyCodes.length
          });

          if (isCorrect) {
            setUnlockedLocks(prev => new Set([...prev, lockIndex]));
          }

          return isCorrect;
        } catch (error) {
          span.setStatus({ code: 2, message: 'Chest key submit error' });
          console.error('Error submitting chest key:', error);
          return false;
        } finally {
          span.end();
        }
      });
  };

  const handleOpenChest = () => {
    const allLocksUnlocked = unlockedLocks.size === chestKeyCodes.length;
    if (allLocksUnlocked) {
      setShowChestModal(false);
      setShowFeedback({
        type: 'success',
        message: 'Congratulations! You have successfully opened the treasure chest and escaped the room! You can now exit the page whenever you want.'
      });
    }
  };

  if (!roomData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading room...
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/escape-room-misc/stage4-bg.png')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 10,
          border: '3px solid #dc3545',
          borderRadius: '8px'
        }}
      />

      {/* Instructions display */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        zIndex: 13,
        fontSize: '14px',
        maxWidth: '300px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>Escape Room:</div>
        <div style={{ marginBottom: '8px' }}>• Move your cursor around to find items</div>
        <div>• Find the treasure to win!</div>
      </div>

      {/* Timer display */}
      {timerSeconds > 0 && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: timeLeft <= 60 ? 'rgba(220, 53, 69, 0.9)' : 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          zIndex: 13,
          fontSize: '18px',
          fontWeight: 'bold',
          minWidth: '120px',
          textAlign: 'center',
          border: timeLeft <= 60 ? '2px solid #dc3545' : 'none'
        }}>
          <div style={{ marginBottom: '8px' }}>⏰ Timer</div>
          <div style={{
            fontSize: '24px',
            color: timeLeft <= 60 ? '#ff6b6b' : '#ffffff'
          }}>
            {formatTime(timeLeft)}
          </div>
        </div>
      )}

      {/* Interactive Items */}
      {roomData.iconLayout.map((item) => (
        <div
          key={item.id}
          onClick={() => handleItemClick(item)}
          style={{
            position: 'absolute',
            left: `${item.x}px`,
            top: `${item.y}px`,
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            zIndex: 12,
            transition: 'transform 0.2s ease',
            filter: unlockedItems.has(item.id) ? 'brightness(1.2)' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.filter = 'brightness(1.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter = unlockedItems.has(item.id) ? 'brightness(1.2)' : 'none';
          }}
        >
          <img
            src={`/escape-room-icons/${item.type}.png`}
            alt={item.type}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
          {unlockedItems.has(item.id) && (
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
          )}
        </div>
      ))}

      {/* Question Modal */}
      {showQuestionModal && currentQuestion && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 20,
          minWidth: '500px',
          maxWidth: '80vw'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Question</h3>
          <p style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.5' }}>
            {currentQuestion.question}
          </p>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              marginBottom: '20px'
            }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowQuestionModal(false);
                setUserAnswer('');
              }}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAnswerSubmit}
              disabled={!userAnswer.trim()}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: !userAnswer.trim() ? 0.6 : 1
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Chest Modal */}
      {showChestModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 20,
          minWidth: '600px',
          maxWidth: '90vw'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Treasure Chest</h3>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>
            You found a chest! But there are {chestKeyCodes.length} locks on it. 
            Enter all the key codes to unlock!
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            {chestKeyCodes.map((_, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: unlockedLocks.has(index) ? '#d4edda' : '#f8f9fa',
                borderRadius: '6px',
                border: unlockedLocks.has(index) ? '2px solid #28a745' : '1px solid #dee2e6'
              }}>
                <span style={{
                  fontWeight: 'bold',
                  marginRight: '10px',
                  minWidth: '80px'
                }}>
                  Lock {index + 1}:
                </span>
                {unlockedLocks.has(index) ? (
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                    ✓ Unlocked
                  </span>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter key code..."
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      width: '150px'
                    }}
                    onKeyPress={async (e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const isCorrect = await handleChestKeySubmit(index, input.value);
                        if (isCorrect) {
                          input.value = '';
                        }
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowChestModal(false)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
            {unlockedLocks.size === chestKeyCodes.length && (
              <button
                onClick={handleOpenChest}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Open Chest!
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completion feedback */}
      {showFeedback && !showQuestionModal && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: showFeedback.type === 'success' ? '#EBB800' : '#f8d7da',
          color: showFeedback.type === 'success' ? '#ffffff' : '#721c24',
          border: `3px solid ${showFeedback.type === 'success' ? '#000000' : '#dc3545'}`,
          borderRadius: '16px',
          padding: '28px',
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          zIndex: 25,
          maxWidth: '80%',
          boxShadow: '0 12px 24px rgba(0,0,0,0.35)'
        }}>
          <div style={{ marginBottom: showFeedback.type === 'error' ? '16px' : '0' }}>
            {showFeedback.message}
          </div>
          {showFeedback.type === 'error' && (
            <button
              onClick={() => {
                setRetryCount(0);
                setShowFeedback(null);
                loadRoom();
              }}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}