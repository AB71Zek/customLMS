'use client';

import { trace } from '@opentelemetry/api';
import React, { useRef, useState } from 'react';

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

interface CombinedEditorProps {
  onSave: (roomData: any) => Promise<any>;
  onBack: () => void;
}

const ICON_TYPES = ['torch', 'barrel', 'scroll', 'key', 'chest'];

export default function CombinedEditor({ onSave, onBack }: CombinedEditorProps) {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: '', expectedAnswers: [''] });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIconSelect = (iconType: string) => {
    setSelectedIcon(iconType);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!selectedIcon || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem: PlacedItem = {
      id: `item_${Date.now()}`,
      type: selectedIcon,
      x: x - 30, // Center the icon
      y: y - 30
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSelectedIcon('');
  };

  const handleItemDoubleClick = (item: PlacedItem) => {
    if (item.type === 'chest') return; // Chest doesn't have questions

    const existingQuestion = questions.find(q => q.itemId === item.id);
    if (existingQuestion) {
      setEditingQuestion(existingQuestion);
      setNewQuestion({
        question: existingQuestion.question,
        expectedAnswers: existingQuestion.expectedAnswers
      });
    } else {
      setEditingQuestion(null);
      setNewQuestion({ question: '', expectedAnswers: [''] });
    }
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = () => {
    if (!newQuestion.question.trim()) return;

    const questionData: Question = {
      itemId: editingQuestion?.itemId || '',
      question: newQuestion.question,
      expectedAnswers: newQuestion.expectedAnswers.filter(answer => answer.trim())
    };

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.itemId === editingQuestion.itemId ? questionData : q
      ));
    } else {
      // Find the last placed item that's not a chest
      const lastItem = placedItems.filter(item => item.type !== 'chest').pop();
      if (lastItem) {
        questionData.itemId = lastItem.id;
        setQuestions(prev => [...prev, questionData]);
      }
    }

    setShowQuestionModal(false);
    setNewQuestion({ question: '', expectedAnswers: [''] });
    setEditingQuestion(null);
  };

  const handleSaveRoom = async () => {
    return await trace
      .getTracer('custom-lms-frontend')
      .startActiveSpan('save-room-editor', async (span) => {
        try {
          setIsSaving(true);
          setSaveError('');

          const roomData = {
            iconLayout: placedItems,
            questions: questions,
            createdBy: 'Teacher'
          };

          span.setAttributes({
            'room.itemsCount': placedItems.length,
            'room.questionsCount': questions.length,
            'room.hasChest': placedItems.some(item => item.type === 'chest')
          });

          await onSave(roomData);
        } catch (error) {
          span.setStatus({ code: 2, message: 'Failed to save room' });
          setSaveError('Failed to save room. Please try again.');
          console.error('Error saving room:', error);
        } finally {
          setIsSaving(false);
          span.end();
        }
      });
  };

  const handleDeleteItem = (itemId: string) => {
    setPlacedItems(prev => prev.filter(item => item.id !== itemId));
    setQuestions(prev => prev.filter(q => q.itemId !== itemId));
  };

  const addExpectedAnswer = () => {
    setNewQuestion(prev => ({
      ...prev,
      expectedAnswers: [...prev.expectedAnswers, '']
    }));
  };

  const updateExpectedAnswer = (index: number, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      expectedAnswers: prev.expectedAnswers.map((answer, i) => 
        i === index ? value : answer
      )
    }));
  };

  const removeExpectedAnswer = (index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      expectedAnswers: prev.expectedAnswers.filter((_, i) => i !== index)
    }));
  };

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

      {/* Editor Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        zIndex: 15,
        minWidth: '300px'
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Escape Room Editor</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <p style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>
            Click icons to place • Double-click to edit questions
          </p>
        </div>

        {/* Icon Selection */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>
            Select Icon to Place:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ICON_TYPES.map(iconType => (
              <button
                key={iconType}
                onClick={() => handleIconSelect(iconType)}
                style={{
                  backgroundColor: selectedIcon === iconType ? '#dc3545' : 'rgba(255, 255, 255, 0.2)',
                  border: `2px solid ${selectedIcon === iconType ? '#dc3545' : 'rgba(255, 255, 255, 0.5)'}`,
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '60px'
                }}
              >
                <img
                  src={`/escape-room-icons/${iconType}.png`}
                  alt={iconType}
                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                />
                <span style={{ fontSize: '10px', marginTop: '4px', textTransform: 'capitalize' }}>
                  {iconType}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSaveRoom}
            disabled={isSaving || placedItems.length === 0}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: (isSaving || placedItems.length === 0) ? 0.6 : 1
            }}
          >
            {isSaving ? 'Saving...' : 'Save Room'}
          </button>
          
          <button
            onClick={onBack}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Back
          </button>
        </div>

        {/* Error Message */}
        {saveError && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '6px',
            marginTop: '15px',
            fontSize: '14px',
            border: '1px solid #f5c6cb'
          }}>
            {saveError}
          </div>
        )}

        {/* Room Stats */}
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <div>Items placed: {placedItems.length}</div>
          <div>Questions created: {questions.length}</div>
        </div>
      </div>

      {/* Interactive Container */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: selectedIcon ? 'crosshair' : 'default',
          zIndex: 12
        }}
      >
        {/* Placed Items */}
        {placedItems.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: '60px',
              height: '60px',
              cursor: 'pointer',
              zIndex: 13,
              transition: 'transform 0.2s ease'
            }}
            onDoubleClick={() => handleItemDoubleClick(item)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
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
            
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item.id);
              }}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Question Indicator */}
            {questions.some(q => q.itemId === item.id) && (
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                ?
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 25,
          minWidth: '600px',
          maxWidth: '90vw'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
            {editingQuestion ? 'Edit Question' : 'Create Question'}
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Question:
            </label>
            <textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter your question..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Expected Answers:
            </label>
            {newQuestion.expectedAnswers.map((answer, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => updateExpectedAnswer(index, e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={() => removeExpectedAnswer(index)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addExpectedAnswer}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Add Answer
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowQuestionModal(false);
                setNewQuestion({ question: '', expectedAnswers: [''] });
                setEditingQuestion(null);
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
              onClick={handleSaveQuestion}
              disabled={!newQuestion.question.trim()}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: !newQuestion.question.trim() ? 0.6 : 1
              }}
            >
              {editingQuestion ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}