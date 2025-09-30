'use client';
import { useState } from 'react';

interface Stage2Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const Stage2 = ({ onSuccess, onCancel }: Stage2Props) => {
  const [mode, setMode] = useState<'intro' | 'quiz'>('intro');
  const [quizSelection, setQuizSelection] = useState<string>('');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: mode === 'intro' ? 'flex-start' : 'center', padding: '24px', zIndex: 20 }}>
      {mode === 'intro' && (
        <>
          <div style={{
            width: '100%',
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 'clamp(18px, 2.2vw, 28px)',
            marginTop: '36px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap'
          }}>
            Oh a lake! You decide to rest near the lake and plan your future moves...
          </div>
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => setMode('quiz')}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffd400'; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-color)'; e.currentTarget.style.color = '#fff'; }}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-color)',
                color: '#fff',
                border: '3px solid var(--border-color)',
                fontWeight: 700,
                letterSpacing: '0.3px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.35)'
              }}
            >
              Proceed
            </button>
          </div>
        </>
      )}

      {mode === 'quiz' && (
        <div className="card er-border er-surface" style={{ maxWidth: '780px', width: '100%' }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ color: 'var(--text-primary)' }}>Stage 2 Quiz</h5>
            <span className="badge" style={{ backgroundColor: '#dc3545', color: 'white', border: '1px solid black' }}>Lake-side Check</span>
          </div>
          <div className="card-body">
            <p className="mb-3" style={{ color: 'var(--text-primary)' }}>Why might explorers choose to rest near a lake?</p>
            <div className="list-group mb-3">
              {[
                { id: 'a', text: 'To avoid drinking water' },
                { id: 'b', text: 'To access fresh water and plan safely' },
                { id: 'c', text: 'Because maps forbid camping elsewhere' }
              ].map(opt => (
                <label key={opt.id} className={`list-group-item d-flex align-items-center ${quizSelection === opt.id ? 'active' : ''}`} style={{ backgroundColor: quizSelection === opt.id ? 'var(--accent-color)' : 'var(--section-bg)', color: 'var(--text-primary)', cursor: 'pointer', borderColor: 'var(--border-color)' }}>
                  <input
                    type="radio"
                    name="stage2-q1"
                    className="form-check-input me-2"
                    checked={quizSelection === opt.id}
                    onChange={() => { setQuizSelection(opt.id); setQuizSubmitted(false); }}
                    style={{ cursor: 'pointer' }}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn er-btn-primary"
                onClick={() => setQuizSubmitted(true)}
                disabled={!quizSelection}
              >
                Submit
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => { onCancel && onCancel(); setMode('intro'); setQuizSelection(''); setQuizSubmitted(false); }}
                style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                Cancel
              </button>
            </div>
            {quizSubmitted && (
              <div className="mt-3">
                {quizSelection === 'b' ? (
                  <>
                    <div className="alert alert-success" role="alert" style={{ backgroundColor: 'var(--accent-color)', color: '#fff', borderColor: 'var(--accent-color)' }}>
                      Correct! Lakes provide rest, resources, and a safe place to plan.
                    </div>
                    <button
                      className="btn er-btn-primary"
                      onClick={() => { onSuccess?.(); setMode('intro'); setQuizSelection(''); setQuizSubmitted(false); }}
                    >
                      Exit Stage
                    </button>
                  </>
                ) : (
                  <div className="alert alert-danger" role="alert" style={{ backgroundColor: '#8b0000', color: '#fff', borderColor: '#8b0000' }}>
                    Not quite. Try selecting another option.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stage2;
