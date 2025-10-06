'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../Components/header';
import { useTheme } from '../../Components/ThemeContext';
import IconEditor from '../editor/IconEditor';
import QuestionCreator from '../editor/QuestionCreator';
import QuestionEditor from '../editor/QuestionEditor';
import StartGame from './StartGame';

export default function MapRoomPage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  // Get timer value from URL parameters
  const timerValue = parseInt(searchParams.get('timer') || '600');
  
  // View state (map, notice, question editor, editor canvas, question creator)
  const [stageView, setStageView] = useState<'none' | 'notice' | 'questions' | 'editor' | 'question-creator'>('notice');
  const [editorStageIndex, setEditorStageIndex] = useState<number>(0);
  const [roomExists, setRoomExists] = useState<boolean>(false);
  const [roomSaved, setRoomSaved] = useState<boolean>(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(timerValue);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(true);

  // Load room existence on mount
  useEffect(() => {
    try {
      setRoomExists(localStorage.getItem('escape-room:room:exists') === 'true');
      setRoomSaved(localStorage.getItem('escape-room:room:saved') === 'true');
    } catch {}
  }, []);

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

  // Treasure Room position and icon
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
            backgroundImage: "url('/escape-room-misc/treasure-map.png')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '3px solid var(--border-color)',
            borderRadius: '8px'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
            {/* Treasure Room icon removed for editor-first flow */}
          </div>
          {/* Notice overlay via StartGame component */}
          {stageView === 'notice' && (
            <StartGame
              timeLeft={timeLeft}
              isTimerPaused={isTimerPaused}
              roomSaved={roomSaved}
              onOpenEditor={() => setStageView('editor')}
              onRestart={() => {
                try {
                  localStorage.removeItem('escape-room:editor:layout');
                  localStorage.removeItem('escape-room:room:exists');
                  localStorage.removeItem('escape-room:room:saved');
                  localStorage.removeItem('escape-room:editor:questions');
                  localStorage.removeItem('escape-room:questions:complete');
                } catch {}
                window.location.replace('/escape-room');
              }}
              onClickTrophy={() => {/* start game next step */}}
            />
          )}
          {stageView === 'questions' && (
            <QuestionEditor stageIndex={editorStageIndex} onClose={() => setStageView('none')} />
          )}
          {stageView === 'editor' && (
            <IconEditor
              onSave={() => { setStageView('notice'); setRoomExists(true); }}
              onCancel={() => setStageView('notice')}
              onStep2={() => setStageView('question-creator')}
            />
          )}
          {stageView === 'question-creator' && (
            <QuestionCreator
              onComplete={() => { setStageView('notice'); setRoomExists(true); setRoomSaved(true); }}
              onBack={() => setStageView('editor')}
            />
          )}
          
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


