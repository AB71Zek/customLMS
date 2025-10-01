'use client';
import { useState } from 'react';

interface Stage4Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const Stage4 = ({ onSuccess, onCancel }: Stage4Props) => {
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
            marginTop: '24px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
          }}>
            Alas! The chest is locked.<br/>
            You decide to use the key from the previous cave...
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
            <h5 className="mb-0" style={{ color: 'var(--text-primary)' }}>Stage 4 Quiz</h5>
            <span className="badge" style={{ backgroundColor: '#dc3545', color: 'white', border: '1px solid black' }}>Final Check</span>
          </div>
          <div className="card-body">
            <p className="mb-3" style={{ color: 'var(--text-primary)' }}>What should you do after finding the locked chest and having a key?</p>
            <div className="list-group mb-3">
              {[
                { id: 'a', text: 'Ignore the chest and leave' },
                { id: 'b', text: 'Use the key to unlock the chest carefully' },
                { id: 'c', text: 'Throw the key into the lake' }
              ].map(opt => (
                <label key={opt.id} className={`list-group-item d-flex align-items-center ${quizSelection === opt.id ? 'active' : ''}`} style={{ backgroundColor: quizSelection === opt.id ? 'var(--accent-color)' : 'var(--section-bg)', color: 'var(--text-primary)', cursor: 'pointer', borderColor: 'var(--border-color)' }}>
                  <input
                    type="radio"
                    name="stage4-q1"
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
                    <div className="alert alert-success" role="alert" style={{ backgroundColor: 'var(--accent-color)', color: '#fff', borderColor: 'var(--accent-color)', fontWeight: 'bold' }}>
                      ✅ <strong>Correct!</strong> Time to open the chest and claim your prize.
                    </div>
                    <button
                      className="btn er-btn-primary"
                      onClick={() => onSuccess?.()}
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <div className="alert alert-danger" role="alert" style={{ backgroundColor: '#8b0000', color: '#fff', borderColor: '#8b0000', fontWeight: 'bold' }}>
                    ❌ <strong>Incorrect!</strong> Try selecting another option.
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

export default Stage4;