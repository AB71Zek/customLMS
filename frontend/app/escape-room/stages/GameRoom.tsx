'use client';
import { useEffect, useState } from 'react';
import { generateKeyCodePart, isAnswerCorrect, loadRoomByCode, type GameplayState, type PlacedItem, type Question } from '../utils/keyCodeGenerator';

interface GameRoomProps {
  roomCode: string;
  onComplete: () => void;
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

export default function GameRoom({ roomCode, onComplete }: GameRoomProps) {
  const [roomData, setRoomData] = useState<{ iconLayout: PlacedItem[], questions: Question[] } | null>(null);
  const [gameplayState, setGameplayState] = useState<GameplayState>({ collectedKeyCodes: [], chestAnswer: '' });
  const [selectedIcon, setSelectedIcon] = useState<PlacedItem | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [completedIcons, setCompletedIcons] = useState<Set<string>>(new Set());
  const [showChestModal, setShowChestModal] = useState<boolean>(false);
  const [chestKeyCodes, setChestKeyCodes] = useState<string[]>([]);
  const [unlockedLocks, setUnlockedLocks] = useState<Set<number>>(new Set());
  const [usedKeyCodes, setUsedKeyCodes] = useState<Set<string>>(new Set());
  const [iconKeyCodeMap, setIconKeyCodeMap] = useState<Map<string, string>>(new Map());

  // Load room data
  useEffect(() => {
    const room = loadRoomByCode(roomCode);
    if (room) {
      setRoomData({ iconLayout: room.iconLayout, questions: room.questions });
      
      // Initialize gameplay state
      const nonChestItems = room.iconLayout.filter(item => item.type !== 'chest');
      const chestAnswer = nonChestItems.map(() => 'XXXX').join(''); // Placeholder
      setGameplayState({ collectedKeyCodes: [], chestAnswer });
      
      // Initialize chest key codes array
      setChestKeyCodes(new Array(nonChestItems.length).fill(''));
    }
  }, [roomCode]);

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
      setShowFeedback({
        type: 'success',
        message: 'Congratulations! You have successfully opened the treasure chest and escaped the room!'
      });
      
      setTimeout(() => {
        onComplete();
      }, 3000);
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
        border: '3px solid var(--border-color)',
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
        <div style={{ marginBottom: '8px' }}>• Look around for clues</div>
        <div>• Find the treasure to win!</div>
      </div>

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
          background: showFeedback.type === 'success' ? '#d4edda' : '#f8d7da',
          color: showFeedback.type === 'success' ? '#155724' : '#721c24',
          border: `2px solid ${showFeedback.type === 'success' ? '#28a745' : '#dc3545'}`,
          borderRadius: '12px',
          padding: '24px',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center',
          zIndex: 15,
          maxWidth: '80%'
        }}>
          {showFeedback.message}
        </div>
      )}
    </div>
  );
}
