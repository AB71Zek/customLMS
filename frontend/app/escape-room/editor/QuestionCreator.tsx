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
  options: string[];
  correctAnswer: number; // index of correct option (0-2)
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
        const initialQuestions: Question[] = parsed.map((item, index) => ({
          id: `question-${item.id}`,
          iconType: item.type,
          question: `What is this ${item.type}?`,
          options: ['Option A', 'Option B', 'Option C'],
          correctAnswer: 0
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
          question: `What is this ${icon.type}?`,
          options: ['Option A', 'Option B', 'Option C'],
          correctAnswer: 0
        };
        setQuestions(prev => [...prev, newQuestion]);
      }
    }
  };

  const handleQuestionChange = (questionId: string, field: keyof Question, value: string | number) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSaveQuestions = () => {
    try {
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
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
          <div style={{ fontSize: '14px', textAlign: 'center', marginTop: '4px', color: '#666' }}>
            Click on any icon below to create its question
          </div>
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
            top: '200px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            maxWidth: '600px',
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid var(--border-color)',
            borderRadius: '12px',
            padding: '20px',
            zIndex: 11
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
                Question:
              </label>
              <textarea
                value={selectedQuestion.question}
                onChange={(e) => handleQuestionChange(selectedQuestion.id, 'question', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
                placeholder="Enter your question here..."
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Answer Options:
              </label>
              {selectedQuestion.options.map((option, index) => (
                <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name={`correct-${selectedQuestion.id}`}
                    checked={selectedQuestion.correctAnswer === index}
                    onChange={() => handleQuestionChange(selectedQuestion.id, 'correctAnswer', index)}
                    style={{ margin: 0 }}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(selectedQuestion.id, index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                </div>
              ))}
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
