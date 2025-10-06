'use client';
import { useEffect, useState } from 'react';

interface PlacedItem {
  id: string;
  type: 'barrel' | 'chest' | 'key' | 'torch' | 'treasure';
  x: number;
  y: number;
}

interface Question {
  id: string;
  iconType: PlacedItem['type'];
  question: string;
  expectedAnswers: string[]; // up to 2 expected answers
  keyCode: string; // code unlocked upon answering this question
}

interface QuestionCreatorProps {
  onComplete: () => void;
  onBack: () => void;
}

const ICON_SOURCES: Record<PlacedItem['type'], string> = {
  barrel: '/escape-room-misc/barrel.png',
  chest: '/escape-room-misc/chest.png',
  key: '/escape-room-misc/key.png',
  torch: '/escape-room-misc/torch.png',
  treasure: '/escape-room-misc/treasure.png',
};

const STORAGE_KEY = 'escape-room:editor:layout';
const QUESTIONS_STORAGE_KEY = 'escape-room:editor:questions';

export default function QuestionCreator({ onComplete, onBack }: QuestionCreatorProps) {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  // Load placed items on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: PlacedItem[] = JSON.parse(saved);
        setPlacedItems(parsed);
        
        // Initialize questions for each icon
        const initialQuestions: Question[] = parsed.map((item) => ({
          id: `question-${item.id}`,
          iconType: item.type,
          question: '',
          expectedAnswers: [''],
          keyCode: ''
        }));
        setQuestions(initialQuestions);
      }
    } catch {}
  }, []);

  const handleIconClick = (iconId: string) => {
    setSelectedIconId(iconId);
    
    // Initialize question if it doesn't exist
    const existingQuestion = questions.find(q => q.id === `question-${iconId}`);
    if (!existingQuestion) {
      const icon = placedItems.find(item => item.id === iconId);
      if (icon) {
        const newQuestion: Question = {
          id: `question-${iconId}`,
          iconType: icon.type,
          question: '',
          expectedAnswers: [''],
          keyCode: ''
        };
        setQuestions(prev => [...prev, newQuestion]);
      }
    }
  };

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

  // Compute chest expected answer from other icons' key codes (ordered by placement order)
  const computeChestExpectedAnswer = (qs: Question[], items: PlacedItem[]) => {
    const codesInOrder = items
      .filter(it => it.type !== 'chest')
      .map(it => {
        const q = qs.find(x => x.id === `question-${it.id}`);
        return (q?.keyCode || '').trim();
      })
      .filter(Boolean);
    // Join with hyphen; adjust later if a different format is desired
    return codesInOrder.join('-');
  };

  // Keep chest question's expectedAnswers in sync with other icons' key codes
  useEffect(() => {
    if (!placedItems.length || !questions.length) return;
    const chestItem = placedItems.find(it => it.type === 'chest');
    if (!chestItem) return;
    const chestId = `question-${chestItem.id}`;
    const newExpected = computeChestExpectedAnswer(questions, placedItems);
    setQuestions(prev => prev.map(q => q.id === chestId ? { ...q, expectedAnswers: [newExpected] } : q));
  }, [questions.map(q => q.keyCode).join('|'), placedItems.map(i => i.id).join('|')]);

  const handleSaveQuestions = () => {
    // Ensure chest expected answer is up to date before save
    try {
      const updated = [...questions];
      const chestItem = placedItems.find(it => it.type === 'chest');
      if (chestItem) {
        const chestId = `question-${chestItem.id}`;
        const newExpected = computeChestExpectedAnswer(updated, placedItems);
        const idx = updated.findIndex(q => q.id === chestId);
        if (idx >= 0) updated[idx] = { ...updated[idx], expectedAnswers: [newExpected] };
      }
      // Validate all non-chest items before completing
      const nonChestItems = placedItems.filter(it => it.type !== 'chest');
      const isItemValid = (itemId: string) => {
        const q = updated.find(x => x.id === `question-${itemId}`);
        if (!q) return false;
        const questionOk = isValidWordCount(q.question);
        const answersOk = q.expectedAnswers.length >= 1 && q.expectedAnswers.length <= 2 && q.expectedAnswers.every(a => isValidWordCount(a));
        const keyOk = isValidWordCount(q.keyCode);
        return questionOk && answersOk && keyOk;
      };
      const allValid = nonChestItems.every(it => isItemValid(it.id));
      if (!allValid) {
        alert('Please complete all questions (1-500 words each) and key codes for all non-chest icons before completing.');
        return;
      }
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem('escape-room:questions:complete', 'true');
    } catch {}
    onComplete();
  };

  const selectedQuestion = selectedIconId ? questions.find(q => q.id === `question-${selectedIconId}`) : null;
  const selectedItem = selectedIconId ? placedItems.find(item => item.id === selectedIconId) : null;

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
          backgroundSize: '89.8vw 89.6vh',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: '3px solid var(--border-color)',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
        {/* Blur overlay when a question is open */}
        {selectedQuestion && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 12
            }}
          />
        )}

        {/* Step 2 Header */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.9)',
          border: '2px solid var(--border-color)',
          borderRadius: '12px',
          padding: '12px 20px',
          zIndex: 11
        }}>
          <div style={{ fontWeight: 800, fontSize: '16px', textAlign: 'center' }}>
            Step 2 - Create your questions!
          </div>
          {(() => {
            const nonChest = placedItems.filter(it => it.type !== 'chest');
            const editedCount = nonChest.filter(it => {
              const q = questions.find(x => x.id === `question-${it.id}`);
              if (!q) return false;
              const questionOk = isValidWordCount(q.question);
              const answersOk = q.expectedAnswers.length >= 1 && q.expectedAnswers.length <= 2 && q.expectedAnswers.every(a => isValidWordCount(a));
              const keyOk = isValidWordCount(q.keyCode);
              return questionOk && answersOk && keyOk;
            }).length;
            const total = nonChest.length;
            return (
              <div style={{ fontSize: '14px', textAlign: 'center', marginTop: '4px', color: '#666' }}>
                Click on any icon below to create its question · Edited {editedCount}/{total}
              </div>
            );
          })()}
        </div>

        {/* Placed Icons - Non-editable */}
        {placedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleIconClick(item.id)}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '56px',
              height: '56px',
              zIndex: 10,
              cursor: 'pointer',
              border: selectedIconId === item.id ? '3px solid #28a745' : '2px solid transparent',
              borderRadius: '8px',
              transition: 'border-color 0.2s ease'
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
          </div>
        ))}

        {/* Question Form - Only show when icon is selected */}
        {selectedQuestion && selectedItem && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '88%',
            maxWidth: '900px',
            maxHeight: '85%',
            overflowY: 'auto',
            background: 'rgba(255,255,255,0.98)',
            border: '2px solid var(--border-color)',
            borderRadius: '12px',
            padding: '20px',
            zIndex: 13,
            boxShadow: '0 12px 28px rgba(0,0,0,0.35)'
          }}>
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>
                Creating question for: {selectedItem.type}
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Edit Question
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                  ({countWords(selectedQuestion.question)}/500 words)
                </span>
              </label>
              <textarea
                value={selectedItem.type === 'chest' ? 'The only way to open this chest is to look find the code' : selectedQuestion.question}
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
                disabled={selectedItem.type === 'chest'}
              />
              {!isValidWordCount(selectedQuestion.question) && selectedItem.type !== 'chest' && (
                <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                  Must be between 1-500 words
                </div>
              )}
            </div>

            {selectedItem.type !== 'chest' && (
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
                  <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => handleExpectedAnswerChange(selectedQuestion.id, index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: `1px solid ${isValidWordCount(answer) ? 'var(--border-color)' : '#dc3545'}`,
                        borderRadius: '6px',
                        fontSize: '14px'
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
                          cursor: 'pointer'
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
            )}

            {selectedItem.type !== 'chest' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Key Code Unlocked
                  <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                    ({countWords(selectedQuestion.keyCode)}/500 words)
                  </span>
                </label>
                <input
                  type="text"
                  value={selectedQuestion.keyCode}
                  onChange={(e) => handleQuestionChange(selectedQuestion.id, 'keyCode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${isValidWordCount(selectedQuestion.keyCode) ? 'var(--border-color)' : '#dc3545'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter Key Code. Eg - xAO219"
                />
                {!isValidWordCount(selectedQuestion.keyCode) && (
                  <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                    Must be between 1-500 words
                  </div>
                )}
              </div>
            )}

            {/* Modal action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  // Save progress and keep on step 2 (close modal)
                  // Validate current icon before saving
                  const q = questions.find(x => x.id === selectedQuestion.id);
                  if (!q) return;
                  if (selectedItem.type !== 'chest') {
                    const questionOk = isValidWordCount(q.question);
                    const answersOk = q.expectedAnswers.length >= 1 && q.expectedAnswers.length <= 2 && q.expectedAnswers.every(a => isValidWordCount(a));
                    const keyOk = isValidWordCount(q.keyCode);
                    if (!questionOk) { alert('Question must be between 1 and 500 words.'); return; }
                    if (!answersOk) { alert('Each expected answer must be between 1 and 500 words (up to 2).'); return; }
                    if (!keyOk) { alert('Key code must be between 1 and 500 words.'); return; }
                  }
                  try {
                    const updated = [...questions];
                    const chestItem = placedItems.find(it => it.type === 'chest');
                    if (chestItem) {
                      const chestId = `question-${chestItem.id}`;
                      const newExpected = computeChestExpectedAnswer(updated, placedItems);
                      const idx = updated.findIndex(q2 => q2.id === chestId);
                      if (idx >= 0) updated[idx] = { ...updated[idx], expectedAnswers: [newExpected] };
                    }
                    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updated));
                  } catch {}
                  setSelectedIconId(null);
                }}
                className="btn btn-primary"
              >
                Save
              </button>
              {selectedItem.type !== 'chest' && (
                <button
                  type="button"
                  onClick={() => {
                    // Reset current question fields
                    setQuestions(prev => prev.map(q => {
                      if (q.id === selectedQuestion.id) {
                        return { ...q, question: '', expectedAnswers: [''], keyCode: '' };
                      }
                      return q;
                    }));
                  }}
                  className="btn btn-outline-secondary"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 11 }}>
          <button
            onClick={onBack}
            className="btn btn-outline-secondary"
            style={{
              backgroundColor: '#ffffff',
              color: '#000',
              borderColor: 'var(--border-color)',
              borderWidth: '2px',
              padding: '8px 16px'
            }}
          >
            Back to Step 1
          </button>
          
          <button
            onClick={handleSaveQuestions}
            className="btn btn-success"
            style={{ padding: '8px 16px' }}
          >
            Complete Questions
          </button>
        </div>
      </div>
    </div>
  );
}
