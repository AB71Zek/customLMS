'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from 'react';
import Header from '../../Components/header';
import { useTheme } from '../../Components/ThemeContext';

export default function MapRoomPage() {
  const { theme } = useTheme();
  // stage status: 'available' | 'locked' | 'completed'
  const [stageStatus] = useState<Array<'available' | 'locked' | 'completed'>>([
    'available', 'locked', 'locked', 'locked'
  ]);

  // Local view state for Stage 1 flow
  const [stageView, setStageView] = useState<'none' | 'stage1-intro' | 'stage1-quiz'>('none');
  const [quizSelection, setQuizSelection] = useState<string>('');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Current stage: index of the first available stage
  const currentStageIndex = useMemo(() => stageStatus.findIndex(s => s === 'available'), [stageStatus]);

  // Initial placeholder positions; you will replace these later
  const positions = [
    { left: '25%', top: '80%' },
    { left: '30%', top: '48%' },
    { left: '56%', top: '48%' },
    { left: '76%', top: '61%' }
  ];

  // Map stage to its icon when available
  const stageIcon: string[] = [
    '/escape-room-misc/anchor.png',
    '/escape-room-misc/compass.png',
    '/escape-room-misc/map.png',
    '/escape-room-misc/trophy.png'
  ];

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", display: 'flex', flexDirection: 'column' }} data-theme={theme}>
      <Header studentNumber="21406232" />
      <div style={{ marginTop: "140px", marginBottom: "20px", flex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Aspect-ratio container to avoid cropping */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth: '1600px',
            maxHeight: '675px',
            aspectRatio: '16 / 9',
            backgroundImage: stageView === 'none' ? "url('/escape-room-misc/treasure-map.png')" : "url('/escape-room-misc/stage1-bg.png')",
            backgroundSize: '89.8vw 89.6vh',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '3px solid var(--border-color)',
            borderRadius: '8px',
            filter: stageView === 'stage1-quiz' ? 'blur(4px)' : 'none'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
            {/* Stage icons layer */}
            {stageView === 'none' && (
            <div style={{ position: 'absolute', inset: 0 }}>
              {positions.map((pos, idx) => {
                const status = stageStatus[idx];
                return (
                  <div
                    key={idx}
                    style={{ position: 'absolute', left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)', textAlign: 'center', cursor: status === 'available' ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (idx === 0 && status === 'available') {
                        setStageView('stage1-intro');
                      }
                    }}
                  >
                    {/* Pointer for current available stage */}
                    {idx === currentStageIndex && (
                      <img
                        src="/escape-room-misc/pointer.png"
                        alt="Pointer"
                        width={100}
                        height={100}
                        style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}
                      />
                    )}

                    {/* Base stage icon always visible */}
                    <img
                      src={stageIcon[idx]}
                      alt={`Stage ${idx + 1}`}
                      width={72}
                      height={72}
                      style={{ zIndex: 1, position: 'relative' }}
                    />

                    {/* Status overlay on top of base icon */}
                    {status !== 'available' && (
                      <img
                        src={status === 'locked' ? '/escape-room-misc/denied.png' : '/escape-room-misc/finished.png'}
                        alt={status}
                        width={85}
                        height={85}
                        style={{ position: 'absolute', inset: 0, margin: 'auto', filter: 'blur(0.5px)', opacity: 0.70, zIndex: 2, transform: 'translateY(-13.2px)' }}
                      />
                    )}

                    <div style={{ marginTop: '6px', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontSize: '14px', position: 'relative', zIndex: 4 }}>Stage {idx + 1}</div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
          {/* Overlays */}
          {stageView === 'stage1-intro' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '24px', zIndex: 10 }}>
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
                You finally see the shores in the distance. It is time for you to drop the anchor!
              </div>
              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={() => setStageView('stage1-quiz')}
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
            </div>
          )}

          {stageView === 'stage1-quiz' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 20 }}>
              <div className="card er-border er-surface" style={{ maxWidth: '780px', width: '100%' }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ color: 'var(--text-primary)' }}>Stage 1 Quiz</h5>
                  <span className="badge" style={{ backgroundColor: '#dc3545', color: 'white', border: '1px solid black' }}>Anchor Knowledge Check</span>
                </div>
                <div className="card-body">
                  <p className="mb-3" style={{ color: 'var(--text-primary)' }}>What is the primary purpose of a ship's anchor?</p>
                  <div className="list-group mb-3">
                    {[
                      { id: 'a', text: 'To increase the ship’s speed' },
                      { id: 'b', text: 'To keep the ship stationary' },
                      { id: 'c', text: 'To steer the ship in rough waters' },
                      { id: 'd', text: 'To signal other ships at night' }
                    ].map(opt => (
                      <label key={opt.id} className={`list-group-item d-flex align-items-center ${quizSelection === opt.id ? 'active' : ''}`} style={{ backgroundColor: quizSelection === opt.id ? 'var(--accent-color)' : 'var(--section-bg)', color: 'var(--text-primary)', cursor: 'pointer', borderColor: 'var(--border-color)' }}>
                        <input
                          type="radio"
                          name="stage1-q1"
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
                      onClick={() => { setStageView('none'); setQuizSelection(''); setQuizSubmitted(false); }}
                      style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                    >
                      Cancel
                    </button>
                  </div>
                  {quizSubmitted && (
                    <div className="mt-3">
                      {quizSelection === 'b' ? (
                        <div className="alert alert-success" role="alert" style={{ backgroundColor: 'var(--accent-color)', color: '#fff', borderColor: 'var(--accent-color)' }}>
                          Correct! The anchor keeps the ship stationary.
                        </div>
                      ) : (
                        <div className="alert alert-danger" role="alert" style={{ backgroundColor: '#8b0000', color: '#fff', borderColor: '#8b0000' }}>
                          Not quite. Try selecting another option.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center" style={{ position: 'absolute', top: 0, left: 1150, right: 0, padding: '12px 16px', zIndex: 1 }}>
            <span className="badge" style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '16px', padding: '9px 12px', borderRadius: '14px', border: '2px solid black'}}>Timer paused</span>
          </div>
        </div>
      </div>
    </div>
  );
}


