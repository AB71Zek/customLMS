'use client';
import { useEffect, useState } from 'react';

// Answer code generation functions (moved from keyCodeGenerator)
export const generateKeyCodePart = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = Math.floor(Math.random() * 3) + 3; // 3-5 characters
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const isAnswerCorrect = (userAnswer: string, expectedAnswers: string[]): boolean => {
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();
  return expectedAnswers.some(expected => 
    expected.toLowerCase().trim() === normalizedUserAnswer
  );
};

// Types (moved from keyCodeGenerator)
export interface GameplayState {
  collectedKeyCodes: string[];
  chestAnswer: string;
}

export interface PlacedItem {
  id: string;
  type: 'barrel' | 'chest' | 'key' | 'torch' | 'treasure';
  x: number;
  y: number;
}

export interface Question {
  id: string;
  iconType: PlacedItem['type'];
  question: string;
  expectedAnswers: string[];
}

// Temporary room interface (will be replaced by backend)
interface TempRoomData {
  roomId: string;
  iconLayout: PlacedItem[];
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

// Load room data from backend (framework for future implementation)
const loadRoomByCode = async (roomCode: string): Promise<TempRoomData | null> => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? `http://${window.location.hostname}:4080`
      : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4080');
    const response = await fetch(`${baseUrl}/api/play/${roomCode}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Room not found');
      }
      throw new Error('Failed to load room');
    }
    
    const roomData = await response.json();
    
    // Transform API response to match expected format
    return {
      roomId: roomData.roomId,
      iconLayout: roomData.iconLayout,
      questions: roomData.questions,
      createdAt: roomData.createdAt,
      createdBy: 'teacher' // Default value since API doesn't return this
    };
  } catch (error) {
    console.error('Error loading room:', error);
    return null;
  }
};

interface GameRoomProps {
  roomCode: string;
  onComplete: () => void;
  timerSeconds?: number;
}

const ICON_SOURCES: Record<PlacedItem['type'], string> = {
  barrel: '/escape-room-misc/barrel.png',
  chest: '/escape-room-misc/chest.png',
  key: '/escape-room-misc/key.png',
  torch: '/escape-room-misc/torch.png',
  treasure: '/escape-room-misc/treasure.png',
};

// Story lines for each icon type (same as in editor)
const ICON_STORIES: Record<PlacedItem['type'], string> = {
  barrel: "You found a barrel, there seems to be an inscription on it... solve it to unlock the hint!",
  chest: "You found a treasure chest! But there are locks on it. Enter all the key codes to unlock!",
  key: "You found a key! There's something written on it... solve the puzzle to unlock its secrets!",
  torch: "You found a torch, there seems to be an inscription on it... solve it to unlock the hint!",
  treasure: "You found a treasure! But it's protected by a riddle... solve it to claim your prize!"
};

export default function GameRoom({ roomCode, onComplete, timerSeconds = 0 }: GameRoomProps) {
  const [roomData, setRoomData] = useState<{ iconLayout: PlacedItem[], questions: Question[] } | null>(null);
  const [gameplayState, setGameplayState] = useState<GameplayState>({ collectedKeyCodes: [], chestAnswer: '' });
  const [selectedIcon, setSelectedIcon] = useState<PlacedItem | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [completedIcons, setCompletedIcons] = useState<Set<string>>(new Set());
  const [showChestModal, setShowChestModal] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [chestKeyCodes, setChestKeyCodes] = useState<string[]>([]);
  const [unlockedLocks, setUnlockedLocks] = useState<Set<number>>(new Set());
  const [usedKeyCodes, setUsedKeyCodes] = useState<Set<string>>(new Set());
  const [iconKeyCodeMap, setIconKeyCodeMap] = useState<Map<string, string>>(new Map());

  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(timerSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer functions
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load room data
  const loadRoom = async () => {
    try {
      const room = await loadRoomByCode(roomCode);
      if (room) {
        setRoomData({ iconLayout: room.iconLayout, questions: room.questions });

        // Initialize gameplay state
        const nonChestItems = room.iconLayout.filter((item: PlacedItem) => item.type !== 'chest');
        const chestAnswer = nonChestItems.map(() => 'XXXX').join(''); // Placeholder
        setGameplayState({ collectedKeyCodes: [], chestAnswer });

        // Initialize chest key codes array
        setChestKeyCodes(new Array(nonChestItems.length).fill(''));
        
        // Reset retry count on success
        setRetryCount(0);
      } else {
        setShowFeedback({ 
          type: 'error', 
          message: 'Room not found. Please check the room code.' 
        });
      }
    } catch (error) {
      console.error('Error loading room:', error);
      setShowFeedback({ 
        type: 'error', 
        message: `Failed to load room. ${retryCount < 2 ? 'Retrying...' : 'Please check your connection and try again.'}` 
      });
      
      // Auto-retry up to 2 times
      if (retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadRoom();
        }, 2000);
      }
    }
  };

  useEffect(() => {
    loadRoom();
  }, [roomCode, retryCount]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerRunning(false);
            // Timer completed - trigger game over
            onComplete();
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
  }, [isTimerRunning, timeLeft, onComplete]);

  // Start timer when room loads and timerSeconds > 0
  useEffect(() => {
    if (timerSeconds > 0 && roomData) {
      setTimeLeft(timerSeconds);
      setIsTimerRunning(true);
    }
  }, [timerSeconds, roomData]);

  const handleIconClick = (icon: PlacedItem) => {
    setSelectedIcon(icon);
    setShowQuestionModal(true);
    setUserAnswer('');
  };

  const handleAnswerSubmit = () => {
    if (!selectedIcon || !roomData) return;

    const question = roomData.questions.find(q => q.id === `question-${selectedIcon.id}`);
    if (!question) return;

    // Check if answer is correct
    const isCorrect = question.expectedAnswers.some(expectedAnswer => 
      isAnswerCorrect(userAnswer, [expectedAnswer])
    );

    if (isCorrect) {
      // Generate key code part
      const keyCodePart = generateKeyCodePart();
      setGameplayState(prev => ({
        ...prev,
        collectedKeyCodes: [...prev.collectedKeyCodes, keyCodePart]
      }));
      
      // Mark icon as completed and store key code mapping
      setCompletedIcons(prev => new Set([...prev, selectedIcon.id]));
      setIconKeyCodeMap(prev => new Map([...prev, [selectedIcon.id, keyCodePart]]));
      
      setShowFeedback({
        type: 'success',
        message: `Correct! You earned key code: ${keyCodePart}`
      });
      
      // Don't auto-close modal, let user see the key code
    } else {
      setShowFeedback({
        type: 'error',
        message: 'Incorrect answer. Try again!'
      });
    }
  };

  const handleChestClick = () => {
    setShowChestModal(true);
  };

  const handleChestKeyCodeChange = (lockIndex: number, value: string) => {
    const newKeyCodes = [...chestKeyCodes];
    newKeyCodes[lockIndex] = value;
    setChestKeyCodes(newKeyCodes);
    
    // Check if this key code matches any collected one and hasn't been used yet
    const collectedKeyCode = gameplayState.collectedKeyCodes.find(code => 
      code.toLowerCase() === value.toLowerCase() && !usedKeyCodes.has(code.toLowerCase())
    );
    
    if (collectedKeyCode) {
      setUnlockedLocks(prev => new Set([...prev, lockIndex]));
      setUsedKeyCodes(prev => new Set([...prev, collectedKeyCode.toLowerCase()]));
    } else {
      setUnlockedLocks(prev => {
        const newSet = new Set(prev);
        newSet.delete(lockIndex);
        return newSet;
      });
      
      // Remove from used codes if it was previously used
      const previouslyUsedCode = Array.from(usedKeyCodes).find(code => 
        code.toLowerCase() === value.toLowerCase()
      );
      if (previouslyUsedCode) {
        setUsedKeyCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(previouslyUsedCode);
          return newSet;
        });
      }
    }
  };

  const handleOpenChest = () => {
    const allLocksUnlocked = unlockedLocks.size === chestKeyCodes.length;
    if (allLocksUnlocked) {
      // Close the chest modal before showing congratulations
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
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        fontSize: '24px',
        zIndex: 10
      }}>
        Loading room...
      </div>
    );
  }

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
        border: '3px solid #dc3545',
        borderRadius: '8px'
      }}
    >
      {/* Dark overlay for exploration feel */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'rgba(0,0,0,0.4)', 
        zIndex: 11
      }} />

      {/* Invisible clickable areas for icons */}
      {roomData.iconLayout.map((icon) => (
        <div
          key={icon.id}
          onClick={() => icon.type === 'chest' ? handleChestClick() : handleIconClick(icon)}
          style={{
            position: 'absolute',
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '80px', // Larger clickable area
            height: '80px',
            cursor: 'pointer',
            zIndex: 12,
            border: completedIcons.has(icon.id) ? '2px solid #28a745' : '2px solid transparent',
            borderRadius: '8px',
            backgroundColor: completedIcons.has(icon.id) ? 'rgba(40, 167, 69, 0.2)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = '#FFD700';
            
            // Show hover text
            const hoverText = document.createElement('div');
            hoverText.id = 'hover-text';
            hoverText.textContent = completedIcons.has(icon.id) ? 'View your key code!' : 'You see something there!';
            hoverText.style.cssText = `
              position: absolute;
              top: -30px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.8);
              color: #FFD700;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              white-space: nowrap;
              z-index: 20;
              pointer-events: none;
            `;
            e.currentTarget.appendChild(hoverText);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = completedIcons.has(icon.id) ? 'rgba(40, 167, 69, 0.2)' : 'transparent';
            e.currentTarget.style.borderColor = completedIcons.has(icon.id) ? '#28a745' : 'transparent';
            
            // Remove hover text
            const hoverText = e.currentTarget.querySelector('#hover-text');
            if (hoverText) {
              hoverText.remove();
            }
          }}
        />
      ))}

      {/* Instructions display */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
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

      {/* Question Modal */}
      {showQuestionModal && selectedIcon && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <div style={{
            background: 'white',
            border: '2px solid var(--border-color)',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80%',
            overflowY: 'auto'
          }}>
            {/* Icon and story */}
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <img 
                src={ICON_SOURCES[selectedIcon.type]} 
                alt={selectedIcon.type} 
                width={48} 
                height={48}
                style={{ 
                  border: '2px solid var(--border-color)', 
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              />
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#6c757d'
              }}>
                <strong>Story:</strong> {ICON_STORIES[selectedIcon.type]}
              </div>
            </div>

            {/* Question */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 600, fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                Question:
              </label>
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '14px',
                minHeight: '60px'
              }}>
                {roomData.questions.find(q => q.id === `question-${selectedIcon.id}`)?.question || 'No question found'}
              </div>
            </div>

            {/* Show key code if already completed */}
            {completedIcons.has(selectedIcon.id) && (
              <div style={{
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', color: '#155724' }}>
                  ✓ Quiz Completed!
                </div>
                <div style={{ marginBottom: '8px', color: '#155724' }}>
                  <strong>Key Code:</strong> {iconKeyCodeMap.get(selectedIcon.id) || 'Not found'}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', fontStyle: 'italic' }}>
                  💡 This code might unlock something...
                </div>
              </div>
            )}

            {/* Answer input - only show if not completed */}
            {!completedIcons.has(selectedIcon.id) && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Your Answer:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                  placeholder="Enter your answer here..."
                />
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: showFeedback.type === 'success' ? '#d4edda' : '#f8d7da',
                color: showFeedback.type === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${showFeedback.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {showFeedback.message}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  setShowFeedback(null);
                }}
                className="btn btn-outline-secondary"
              >
                Close
              </button>
              {!completedIcons.has(selectedIcon.id) && (
                <button
                  onClick={handleAnswerSubmit}
                  className="btn btn-primary"
                  disabled={!userAnswer.trim()}
                >
                  Submit Answer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chest Modal */}
      {showChestModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <div style={{
            background: 'white',
            border: '2px solid var(--border-color)',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80%',
            overflowY: 'auto'
          }}>
            {/* Chest icon and story */}
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <img 
                src={ICON_SOURCES.chest} 
                alt="chest" 
                width={64} 
                height={64}
                style={{ 
                  border: '2px solid var(--border-color)', 
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              />
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#6c757d'
              }}>
                <strong>Story:</strong> {ICON_STORIES.chest}
              </div>
            </div>

            {/* Key code inputs */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 600, fontSize: '16px', display: 'block', marginBottom: '12px' }}>
                Enter Key Codes to Unlock Locks:
              </label>
              {chestKeyCodes.map((keyCode, index) => (
                <div key={index} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontWeight: 600, minWidth: '80px' }}>
                    Lock {index + 1}:
                  </label>
                  <input
                    type="text"
                    value={keyCode}
                    onChange={(e) => handleChestKeyCodeChange(index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: `2px solid ${unlockedLocks.has(index) ? '#28a745' : '#dc3545'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: unlockedLocks.has(index) ? '#d4edda' : '#ffffff'
                    }}
                    placeholder={`Enter key code ${index + 1}`}
                  />
                  {unlockedLocks.has(index) && (
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px' }}>
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowChestModal(false)}
                className="btn btn-outline-secondary"
              >
                Close
              </button>
              {unlockedLocks.size === chestKeyCodes.length && (
                <button
                  onClick={handleOpenChest}
                  className="btn btn-success"
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    borderColor: '#28a745',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Open Chest!
                </button>
              )}
            </div>
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
