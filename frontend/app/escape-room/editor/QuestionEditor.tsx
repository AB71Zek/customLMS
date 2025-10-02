'use client';
import { useEffect, useMemo, useState } from 'react';

type Choice = {
  text: string;
};

type Question = {
  id: string;
  text: string;
  choices: [Choice, Choice, Choice];
  correctIndex: 0 | 1 | 2;
};

interface QuestionEditorProps {
  stageIndex: number; // 0-based
  onClose: () => void;
}

const MAX_QUESTIONS = 5;

const QuestionEditor = ({ stageIndex, onClose }: QuestionEditorProps) => {
  const storageKey = useMemo(() => `escape-room:stage:${stageIndex}:questions`, [stageIndex]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Question[];
        // Ensure structure
        const sanitized = parsed.slice(0, MAX_QUESTIONS).map((q, idx) => ({
          id: q.id || `q-${idx}`,
          text: q.text || '',
          choices: [
            { text: q.choices?.[0]?.text ?? '' },
            { text: q.choices?.[1]?.text ?? '' },
            { text: q.choices?.[2]?.text ?? '' },
          ] as [Choice, Choice, Choice],
          correctIndex: (q.correctIndex ?? 0) as 0 | 1 | 2
        }));
        setQuestions(sanitized);
      } else {
        setQuestions([]);
      }
    } catch {
      setQuestions([]);
    } finally {
      setHasLoaded(true);
    }
  }, [storageKey]);

  const persist = (data: Question[]) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {}
  };

  const addQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) return;
    const next: Question = {
      id: `q-${Date.now()}`,
      text: '',
      choices: [{ text: '' }, { text: '' }, { text: '' }],
      correctIndex: 0
    };
    const updated = [...questions, next];
    setQuestions(updated);
    persist(updated);
  };

  const updateQuestionText = (qid: string, text: string) => {
    const updated = questions.map(q => q.id === qid ? { ...q, text } : q);
    setQuestions(updated);
    persist(updated);
  };

  const updateChoiceText = (qid: string, idx: 0 | 1 | 2, text: string) => {
    const updated = questions.map(q => {
      if (q.id !== qid) return q;
      const choices = [...q.choices] as [Choice, Choice, Choice];
      choices[idx] = { text };
      return { ...q, choices };
    });
    setQuestions(updated);
    persist(updated);
  };

  const setCorrectIndex = (qid: string, idx: 0 | 1 | 2) => {
    const updated = questions.map(q => q.id === qid ? { ...q, correctIndex: idx } : q);
    setQuestions(updated);
    persist(updated);
  };

  const removeQuestion = (qid: string) => {
    const updated = questions.filter(q => q.id !== qid);
    setQuestions(updated);
    persist(updated);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div className="card er-border er-surface" style={{ position: 'relative', maxWidth: '960px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0" style={{ color: 'var(--text-primary)' }}>Stage {stageIndex + 1} Questions (max {MAX_QUESTIONS})</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={onClose} style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Close</button>
            <button className="btn er-btn-primary btn-sm" onClick={addQuestion} disabled={questions.length >= MAX_QUESTIONS}>Add Question</button>
          </div>
        </div>
        <div className="card-body" style={{ color: 'var(--text-primary)' }}>
          {!hasLoaded ? (
            <div>Loading…</div>
          ) : (
            <>
              {questions.length === 0 && (
                <div className="alert" style={{ backgroundColor: 'var(--textarea-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                  No questions yet. Click "Add Question" to start. Each question has exactly 3 answer choices and one correct answer.
                </div>
              )}
              {questions.map((q, i) => (
                <div key={q.id} className="mb-4 p-3" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--section-bg)' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <label className="form-label mb-0">Question {i + 1}</label>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeQuestion(q.id)} style={{ color: '#fff', borderColor: '#dc3545', background: '#8b0000' }}>Remove</button>
                  </div>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter question text"
                    value={q.text}
                    onChange={(e) => updateQuestionText(q.id, e.target.value)}
                    style={{ backgroundColor: 'var(--textarea-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                  />
                  <div className="row g-3">
                    {[0,1,2].map((idx) => (
                      <div key={idx} className="col-md-4">
                        <div className="input-group">
                          <span className="input-group-text" style={{ backgroundColor: 'var(--textarea-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Choice {Number(idx)+1}</span>
                          <input
                            type="text"
                            className="form-control"
                            value={q.choices[idx as 0|1|2].text}
                            onChange={(e) => updateChoiceText(q.id, idx as 0|1|2, e.target.value)}
                            placeholder={`Answer ${Number(idx)+1}`}
                            style={{ backgroundColor: 'var(--textarea-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                          />
                          <span className="input-group-text" style={{ backgroundColor: 'var(--textarea-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctIndex === (idx as 0|1|2)}
                              onChange={() => setCorrectIndex(q.id, idx as 0|1|2)}
                              style={{ cursor: 'pointer' }}
                            />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;


