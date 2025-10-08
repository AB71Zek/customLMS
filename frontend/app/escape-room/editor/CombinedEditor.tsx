'use client';
import { useEffect, useRef, useState } from 'react';

// Link generator functions (moved from keyCodeGenerator)
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

export interface RoomData {
  roomId: string;
  iconLayout: PlacedItem[];
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

// Generate unique room ID (8 characters for better uniqueness)
export const generateRoomId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate embeddable link for external websites
export const generateEmbedLink = (roomId: string): string => {
  // This will be the URL where the game runs on your EC2 server
  const baseUrl = process.env.NEXT_PUBLIC_GAME_SERVER_URL || 'https://your-ec2-server.com';
  return `${baseUrl}/play/${roomId}`;
};

// Generate iframe embed code for websites
export const generateEmbedCode = (roomId: string): string => {
  const embedUrl = generateEmbedLink(roomId);
  return `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
};

// Save room data to backend (framework for future implementation)
export const saveRoomToBackend = async (roomData: RoomData): Promise<{ success: boolean; roomId?: string; error?: string }> => {
  try {
    // TODO: Replace with actual backend API call
    // const response = await fetch('/api/rooms', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(roomData)
    // });
    // return await response.json();
    
    // For now, simulate success
    console.log('Saving room to backend:', roomData);
    return { success: true, roomId: roomData.roomId };
  } catch (error) {
    return { success: false, error: 'Failed to save room' };
  }
};

interface CombinedEditorProps {
  onComplete: (roomId: string) => void;
  onCancel: () => void;
}

const ICON_SOURCES: Record<PlacedItem['type'], string> = {
  barrel: '/escape-room-misc/barrel.png',
  chest: '/escape-room-misc/chest.png',
  key: '/escape-room-misc/key.png',
  torch: '/escape-room-misc/torch.png',
  treasure: '/escape-room-misc/treasure.png',
};

const TOOLBOX_ITEMS: PlacedItem['type'][] = ['barrel', 'chest', 'key', 'torch', 'treasure'];

const STORAGE_KEY = 'escape-room:editor:layout';
const QUESTIONS_STORAGE_KEY = 'escape-room:editor:questions';

// Story lines for each icon type
const ICON_STORIES: Record<PlacedItem['type'], string> = {
  barrel: "You found a barrel, there seems to be an inscription on it... solve it to unlock the hint!",
  chest: "You found a treasure chest! But there are locks on it. Enter all the key codes to unlock!",
  key: "You found a key! There's something written on it... solve the puzzle to unlock its secrets!",
  torch: "You found a torch, there seems to be an inscription on it... solve it to unlock the hint!",
  treasure: "You found a treasure! But it's protected by a riddle... solve it to claim your prize!"
};

export default function CombinedEditor({ onComplete, onCancel }: CombinedEditorProps) {
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Load saved layout and questions
  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem(STORAGE_KEY);
      if (savedLayout) {
        const parsed: PlacedItem[] = JSON.parse(savedLayout);
        setItems(parsed);
        
        // Initialize questions for each icon
        const initialQuestions: Question[] = parsed.map((item) => ({
          id: `question-${item.id}`,
          iconType: item.type,
          question: '',
          expectedAnswers: ['']
        }));
        setQuestions(initialQuestions);
      }
    } catch {}
  }, []);

  // Global mouse listeners for robust dragging
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!draggingId || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setItems(prev => prev.map(item => 
        item.id === draggingId ? { ...item, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : item
      ));
    };

    const handleUp = () => {
      setDraggingId(null);
      isDraggingRef.current = false;
    };

    if (draggingId) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [draggingId]);

  // Helper function to count words
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Helper function to validate word count
  const isValidWordCount = (text: string) => {
    const wordCount = countWords(text);
    return wordCount >= 1 && wordCount <= 500;
  };

  const handleQuestionChange = (questionId: string, field: keyof Question, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleExpectedAnswerChange = (questionId: string, answerIndex: number, value: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newAnswers = [...q.expectedAnswers];
        newAnswers[answerIndex] = value;
        return { ...q, expectedAnswers: newAnswers };
      }
      return q;
    }));
  };

  const addExpectedAnswer = (questionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId && q.expectedAnswers.length < 2) {
        return { ...q, expectedAnswers: [...q.expectedAnswers, ''] };
      }
      return q;
    }));
  };

  const removeExpectedAnswer = (questionId: string, answerIndex: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId && q.expectedAnswers.length > 1) {
        const newAnswers = q.expectedAnswers.filter((_, index) => index !== answerIndex);
        return { ...q, expectedAnswers: newAnswers };
      }
      return q;
    }));
  };

  const handleIconClick = (iconType: PlacedItem['type']) => {
    const newItem: PlacedItem = {
      id: `item-${Date.now()}`,
      type: iconType,
      x: 50, // Center initially
      y: 50
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleItemDoubleClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowQuestionForm(true);
    
    // Initialize question if it doesn't exist
    const existingQuestion = questions.find(q => q.id === `question-${itemId}`);
    if (!existingQuestion) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        const newQuestion: Question = {
          id: `question-${itemId}`,
          iconType: item.type,
          question: '',
          expectedAnswers: ['']
        };
        setQuestions(prev => [...prev, newQuestion]);
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setQuestions(prev => prev.filter(q => q.id !== `question-${itemId}`));
  };

  const handleSave = async () => {
    // Validate all questions
    const nonChestItems = items.filter(it => it.type !== 'chest');
    const isItemValid = (itemId: string) => {
      const q = questions.find(x => x.id === `question-${itemId}`);
      if (!q) return false;
      const questionOk = isValidWordCount(q.question);
      const answersOk = q.expectedAnswers.length >= 1 && q.expectedAnswers.length <= 2 && q.expectedAnswers.every(a => isValidWordCount(a));
      return questionOk && answersOk;
    };
    const allValid = nonChestItems.every(it => isItemValid(it.id));
    
    if (!allValid) {
      alert('Please complete all questions (1-500 words each) for all non-chest icons before saving.');
      return;
    }

    // Save layout and questions
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    } catch {}

    // Generate room ID and save room data
    const roomId = generateRoomId();
    const roomData: RoomData = {
      roomId,
      iconLayout: items,
      questions: questions,
      createdAt: new Date().toISOString(),
      createdBy: 'teacher'
    };
    
    // Save room to backend (will be implemented when server is ready)
    await saveRoomToBackend(roomData);
    onComplete(roomId);
  };

  const selectedQuestion = selectedItemId ? questions.find(q => q.id === `question-${selectedItemId}`) : null;
  const selectedItem = selectedItemId ? items.find(item => item.id === selectedItemId) : null;

  // Requirements validation
  const requirements = {
    hasAtLeastOne: items.length >= 1,
    hasExactlyOneChest: items.filter(item => item.type === 'chest').length === 1,
    withinMaxLimit: items.length <= 5
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: '1600px',
          maxHeight: '675px',
          aspectRatio: '16 / 9',
          backgroundImage: "url('/escape-room-misc/stage4-bg.png')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: '3px solid var(--border-color)',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
        }}
        ref={containerRef}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
        
        {/* Instructions and Requirements */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(255,255,255,0.9)',
          border: '2px solid var(--border-color)',
          borderRadius: '12px',
          padding: '12px 20px',
          zIndex: 11,
          maxWidth: '400px'
        }}>
          <div style={{ fontWeight: 800, fontSize: '16px', textAlign: 'center', marginBottom: '8px' }}>
            Combined Editor
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center', marginBottom: '8px', color: '#666' }}>
            Drag icons to place • Double-click to edit questions
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, backgroundColor: '#fff8d1', border: '1px solid #ffe58f', borderRadius: '6px', padding: '6px 8px', marginTop: '4px' }}>
            <div style={{ color: '#dc3545' }}>📋 Requirements:</div>
            <div style={{ color: requirements.hasAtLeastOne ? '#28a745' : '#dc3545' }}>
              • Place at least 1 icon
            </div>
            <div style={{ color: requirements.hasExactlyOneChest ? '#28a745' : '#dc3545' }}>
              • Place exactly 1 chest icon
            </div>
            <div style={{ color: requirements.withinMaxLimit ? '#28a745' : '#dc3545' }}>
              • Maximum 5 icons total
            </div>
          </div>
        </div>

        {/* Icon Toolbox */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.9)',
          border: '2px solid var(--border-color)',
          borderRadius: '12px',
          padding: '12px',
          zIndex: 11,
          display: 'flex',
          gap: '8px'
        }}>
          {TOOLBOX_ITEMS.map((iconType) => (
            <div
              key={iconType}
              onClick={() => handleIconClick(iconType)}
              style={{
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                border: '2px solid transparent',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s ease',
                backgroundColor: 'rgba(255,255,255,0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#28a745';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <img
                src={ICON_SOURCES[iconType]}
                alt={iconType}
                style={{ width: '40px', height: '40px', userSelect: 'none', pointerEvents: 'none' }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </div>

        {/* Placed Icons */}
        {items.map((item) => (
          <div
            key={item.id}
            onDoubleClick={() => handleItemDoubleClick(item.id)}
            onMouseDown={(e) => {
              e.preventDefault();
              setDraggingId(item.id);
              isDraggingRef.current = true;
            }}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '56px',
              height: '56px',
              zIndex: 10,
              cursor: 'move',
              border: '2px solid transparent',
              borderRadius: '8px',
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#28a745';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <img
              src={ICON_SOURCES[item.type]}
              alt={item.type}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              style={{
                width: '56px',
                height: '56px',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            />
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item.id);
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '20px',
                height: '20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 12
              }}
            >
              ×
            </button>
          </div>
        ))}

        {/* Question Form Modal */}
        {showQuestionForm && selectedQuestion && selectedItem && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.98)',
              border: '2px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80%',
              overflowY: 'auto',
              boxShadow: '0 12px 28px rgba(0,0,0,0.35)'
            }}>
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>
                  Editing: {selectedItem.type}
                </div>
                <img 
                  src={ICON_SOURCES[selectedItem.type]} 
                  alt={selectedItem.type} 
                  width={40} 
                  height={40}
                  style={{ 
                    border: '2px solid var(--border-color)', 
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '4px'
                  }}
                />
              </div>

              {/* Story Line (uneditable) */}
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#6c757d'
              }}>
                <strong>Story:</strong> {selectedItem.type === 'chest' 
                  ? `You found a treasure chest! But there are ${items.filter(item => item.type !== 'chest').length} locks on it. Enter all the key codes to unlock!`
                  : ICON_STORIES[selectedItem.type]
                }
              </div>

              {/* Question and Answer Fields - Only for non-chest icons */}
              {selectedItem.type !== 'chest' && (
                <>
                  {/* Question Field */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                      Edit Question
                      <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                        ({countWords(selectedQuestion.question)}/500 words)
                      </span>
                    </label>
                    <textarea
                      value={selectedQuestion.question}
                      onChange={(e) => handleQuestionChange(selectedQuestion.id, 'question', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${isValidWordCount(selectedQuestion.question) ? 'var(--border-color)' : '#dc3545'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                      placeholder="Enter your question here..."
                    />
                    {!isValidWordCount(selectedQuestion.question) && (
                      <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                        Must be between 1-500 words
                      </div>
                    )}
                  </div>

                  {/* Expected Answers */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                      Expected Answers
                      {selectedQuestion.expectedAnswers.length < 2 && (
                        <button
                          type="button"
                          onClick={() => addExpectedAnswer(selectedQuestion.id)}
                          style={{
                            marginLeft: '8px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          + Add
                        </button>
                      )}
                    </label>
                {selectedQuestion.expectedAnswers.map((answer, index) => (
                  <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <textarea
                      value={answer}
                      onChange={(e) => handleExpectedAnswerChange(selectedQuestion.id, index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: `1px solid ${isValidWordCount(answer) ? 'var(--border-color)' : '#dc3545'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                      placeholder={`Expected answer ${index + 1}`}
                    />
                    {selectedQuestion.expectedAnswers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExpectedAnswer(selectedQuestion.id, index)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          alignSelf: 'flex-start',
                          marginTop: '4px'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                    {selectedQuestion.expectedAnswers.some(answer => !isValidWordCount(answer)) && (
                      <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                        Each answer must be between 1-500 words
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Chest-specific message */}
              {selectedItem.type === 'chest' && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#856404'
                }}>
                  <strong>Note:</strong> The chest will automatically unlock when all other icons&apos; key codes are collected during gameplay.
                </div>
              )}

              {/* Modal action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowQuestionForm(false)}
                  className="btn btn-outline-secondary"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Skip validation for chest icons
                    if (selectedItem?.type === 'chest') {
                      setShowQuestionForm(false);
                      return;
                    }
                    
                    // Validate current question before closing
                    const q = questions.find(x => x.id === selectedQuestion.id);
                    if (!q) return;
                    const questionOk = isValidWordCount(q.question);
                    const answersOk = q.expectedAnswers.length >= 1 && q.expectedAnswers.length <= 2 && q.expectedAnswers.every(a => isValidWordCount(a));
                    if (!questionOk) { alert('Question must be between 1 and 500 words.'); return; }
                    if (!answersOk) { alert('Each expected answer must be between 1 and 500 words (up to 2).'); return; }
                    setShowQuestionForm(false);
                  }}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 11 }}>
          <button
            onClick={onCancel}
            className="btn btn-outline-secondary"
            style={{
              backgroundColor: '#ffffff',
              color: '#000',
              borderColor: 'var(--border-color)',
              borderWidth: '2px',
              padding: '10px 18px',
              fontSize: '15px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-success"
            style={{ padding: '10px 18px', fontSize: '15px' }}
            disabled={!requirements.hasAtLeastOne || !requirements.hasExactlyOneChest || !requirements.withinMaxLimit}
          >
            Save Room
          </button>
        </div>
      </div>
    </div>
  );
}
