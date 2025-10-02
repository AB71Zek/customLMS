'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../Components/header';
import { useTheme } from '../../Components/ThemeContext';
import QuestionEditor from '../questions/QuestionEditor';
import Stage4 from '../stages/Stage4';
import StageEnd from '../stages/StageEnd';

export default function MapRoomPage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  // Get timer value from URL parameters
  const timerValue = parseInt(searchParams.get('timer') || '600');
  
  // View state (map, stage4, question editor, or end screen)
  const [stageView, setStageView] = useState<'none' | 'stage4' | 'questions' | 'end'>('none');
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

  // Stage 4 position and icon
  const stage4Position = { left: '76%', top: '61%' };
  const stage4Icon = '/escape-room-misc/trophy.png';

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
            {/* Stage 4 icon */}
            {stageView === 'none' && (
              <div style={{ position: 'absolute', left: stage4Position.left, top: stage4Position.top, transform: 'translate(-50%, -50%)', textAlign: 'center', cursor: 'pointer' }}
                   onClick={() => {
                     setStageView('stage4');
                     setIsTimerPaused(false);
                     setIsTimerRunning(true);
                   }}>
                <img
                  src={stage4Icon}
                  alt="Stage 4"
                  width={72}
                  height={72}
                  style={{ zIndex: 1, position: 'relative' }}
                />
                <div style={{ marginTop: '6px', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontSize: '14px', position: 'relative', zIndex: 4 }}>Stage 4</div>
              </div>
            )}
          </div>
          {/* Overlays */}
          {stageView === 'stage4' && (
            <Stage4
              onSuccess={() => {
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
          
          {/* Edit Questions Button - only visible on map screen */}
          {stageView === 'none' && (
            <div style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', zIndex: 1 }}>
              <button
                onClick={() => setStageView('questions')}
                className="btn btn-outline-primary"
                style={{
                  backgroundColor: '#00bcd4',
                  color: '#fff',
                  borderColor: '#000',
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  fontWeight: 600,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  fontSize: '16px',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00acc1';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00bcd4';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Edit Questions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


