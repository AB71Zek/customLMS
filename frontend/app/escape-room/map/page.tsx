'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Header from '../../Components/header';
import { useTheme } from '../../Components/ThemeContext';
import QuestionEditor from '../questions/QuestionEditor';
import Stage1 from '../stages/Stage1';
import Stage2 from '../stages/Stage2';
import Stage3 from '../stages/Stage3';
import Stage4 from '../stages/Stage4';
import StageEnd from '../stages/StageEnd';

export default function MapRoomPage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  // Get timer value from URL parameters
  const timerValue = parseInt(searchParams.get('timer') || '600');
  
  // stage status: 'available' | 'locked' | 'completed'
  const [stageStatus, setStageStatus] = useState<Array<'available' | 'locked' | 'completed'>>([
    'available', 'locked', 'locked', 'locked'
  ]);

  // Local view state for Stage overlays
  const [stageView, setStageView] = useState<'none' | 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'end' | 'questions'>('none');
  const [editorStageIndex, setEditorStageIndex] = useState<number>(0);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(timerValue);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(true);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && !isTimerPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerRunning(false);
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
  }, [isTimerRunning, isTimerPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            backgroundImage: stageView === 'none'
              ? "url('/escape-room-misc/treasure-map.png')"
              : stageView === 'stage1'
                ? "url('/escape-room-misc/stage1-bg.png')"
              : stageView === 'stage2'
                  ? "url('/escape-room-misc/stage2-bg.png')"
                  : stageView === 'stage3'
                    ? "url('/escape-room-misc/stage3-bg.png')"
                    : stageView === 'stage4'
                      ? "url('/escape-room-misc/stage4-bg.png')"
                      : "url('/escape-room-misc/treasure-map.png')",
            backgroundSize: '89.8vw 89.6vh',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '3px solid var(--border-color)',
            borderRadius: '8px'
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
                        setStageView('stage1');
                        setIsTimerPaused(false);
                        setIsTimerRunning(true);
                      } else if (idx === 1 && status === 'available') {
                        setStageView('stage2');
                        setIsTimerPaused(false);
                        setIsTimerRunning(true);
                      } else if (idx === 2 && status === 'available') {
                        setStageView('stage3');
                        setIsTimerPaused(false);
                        setIsTimerRunning(true);
                      } else if (idx === 3 && status === 'available') {
                        setStageView('stage4');
                        setIsTimerPaused(false);
                        setIsTimerRunning(true);
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
          {stageView === 'stage1' && (
            <Stage1
              onSuccess={() => {
                setStageStatus(prev => {
                  const next = [...prev];
                  next[0] = 'completed';
                  if (next[1] === 'locked') next[1] = 'available';
                  return next;
                });
                setStageView('none');
                setIsTimerPaused(true);
              }}
              onCancel={() => { setStageView('none'); setIsTimerPaused(true); }}
            />
          )}
          {stageView === 'stage2' && (
            <Stage2
              onSuccess={() => {
                setStageStatus(prev => {
                  const next = [...prev];
                  next[1] = 'completed';
                  if (next[2] === 'locked') next[2] = 'available';
                  return next;
                });
                setStageView('none');
                setIsTimerPaused(true);
              }}
              onCancel={() => { setStageView('none'); setIsTimerPaused(true); }}
            />
          )}
          {stageView === 'stage3' && (
            <Stage3
              onSuccess={() => {
                setStageStatus(prev => {
                  const next = [...prev];
                  next[2] = 'completed';
                  if (next[3] === 'locked') next[3] = 'available';
                  return next;
                });
                setStageView('none');
                setIsTimerPaused(true);
              }}
              onCancel={() => { setStageView('none'); setIsTimerPaused(true); }}
            />
          )}
          {stageView === 'stage4' && (
            <Stage4
              onSuccess={() => {
                setStageStatus(prev => {
                  const next = [...prev];
                  next[3] = 'completed';
                  return next;
                });
                setStageView('end');
                setIsTimerPaused(true);
              }}
              onCancel={() => { setStageView('none'); setIsTimerPaused(true); }}
            />
          )}
          {stageView === 'end' && (
            <div style={{ position: 'absolute', inset: 0, padding: 0, margin: 0, zIndex: 5 }}>
              <StageEnd onExit={() => { window.location.href = '/escape-room'; }} />
            </div>
          )}
          {stageView === 'questions' && (
            <QuestionEditor stageIndex={editorStageIndex} onClose={() => setStageView('none')} />
          )}
          <div className="d-flex justify-content-between align-items-center" style={{ position: 'absolute', top: 0, left: 1125, right: 0, padding: '12px 16px', zIndex: 1 }}>
            <span className="badge" style={{ 
              backgroundColor: isTimerPaused ? '#dc3545' : '#55e676', 
              color: 'white', 
              fontSize: '16px', 
              padding: '9px 12px', 
              borderRadius: '14px', 
              border: '2px solid black'
            }}>
              ⏱️ {formatTime(timeLeft)} {isTimerPaused ? '(paused)' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


