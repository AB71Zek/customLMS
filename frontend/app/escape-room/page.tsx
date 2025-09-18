'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../Components/header';
import { useTheme } from '../Components/ThemeContext';
import Stage1 from './stages/Stage1';
import Stage2 from './stages/Stage2';
import Stage3 from './stages/Stage3';
import Stage4 from './stages/Stage4';

export default function EscapeRoom() {
  const { theme } = useTheme();
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [customTimer, setCustomTimer] = useState<number>(600);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed' | 'timeup'>('menu');
  const [currentStage, setCurrentStage] = useState(1);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const timerOptions = [
    { value: 300, label: "5 minutes", description: "Quick challenge" },
    { value: 600, label: "10 minutes", description: "Recommended" },
    { value: 900, label: "15 minutes", description: "Extended time" },
    { value: 1200, label: "20 minutes", description: "Maximum time" }
  ];

  const handleTimerSelect = (timerValue: number) => {
    setSelectedTimer(timerValue);
  };
  //Custom timer
  const handleCustomTimerChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 60 && numValue <= 1800) {
      setCustomTimer(numValue);
      setSelectedTimer(numValue);
    }
  };

  // No inline map state here; map lives on /escape-room/map

  const completeStage = () => {
    if (currentStage < 4) {
      setCurrentStage(currentStage + 1);
    } else {
      setGameState('completed');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentStage(1);
    setTimeLeft(0);
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setGameState('timeup');
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
  }, [gameState, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <Stage1 onComplete={completeStage} />;
      case 2:
        return <Stage2 onComplete={completeStage} />;
      case 3:
        return <Stage3 onComplete={completeStage} />;
      case 4:
        return <Stage4 onComplete={completeStage} />;
      default:
        return null;
    }
  };

  // Map page lives at /escape-room/map

  return (
    <div className="container theme-transition escape-room" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ marginTop: "133px", marginBottom: "20px"}}>
        {gameState === 'menu' && (
          <div className="row justify-content-center" style={{ height: '100%' }}>
            <div className="col-md-10" style={{ height: '100%' }}>
              <div className="card" style={{
                  backgroundColor: "var(--section-bg)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                backgroundImage: "url('/escape-room-misc/timer-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
                height: '100%'
              }}>
                {/* Overlay for better text readability */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  borderRadius: "inherit"
                }}></div>
                
                <div className="card-body text-center er-on-image" style={{ position: "relative", zIndex: 1 }}>
                  {/* Header - Welcome to escape room */}
                  <h1 className="display-4 mb-4 er-timer-text" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
                    Welcome to Escape Room
                  </h1>
                  
                  {/* Before we start, select timer section */}
                  <div className="mb-4">
                    <h2 className="card-title mb-3 er-timer-text" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
                      Select Timer:
                    </h2>
                    <p className="card-text mb-4 er-timer-text" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                      Choose how much time you want to complete the escape room challenge.
                    </p>
                    
                    {/* Predefined Timer Options */}
                    <div className="row mb-4">
                      {timerOptions.map((option) => (
                        <div key={option.value} className="col-md-6 mb-3">
                          <div 
                            className={`card ${selectedTimer === option.value ? 'border-primary' : ''}`}
                              style={{
                                backgroundColor: selectedTimer === option.value ? "var(--accent-color)" : "var(--textarea-bg)",
                                color: selectedTimer === option.value ? "white" : "var(--tab-inacvtive-bg)",
                                cursor: "pointer",
                                border: selectedTimer === option.value ? "2px solid var(--accent-color)" : "2px solid var(--border-color)",
                                minHeight: "120px"
                              }}
                            onClick={() => handleTimerSelect(option.value)}
                          >
                            <div className="card-body text-center d-flex flex-column justify-content-center" style={{ height: "100%" }}>
                              <h5 className="card-title">{option.label}</h5>
                              <p className="card-text small">{option.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Custom Timer Option */}
                    <div className="row mb-4">
                      <div className="col-md-8 mx-auto">
                        <label className="form-label er-timer-text" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>Or set custom time (60-1800 seconds):</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={customTimer}
                            onChange={(e) => handleCustomTimerChange(e.target.value)}
                            min="60"
                            max="1800"
                            style={{
                              backgroundColor: "var(--textarea-bg)",
                              color: "var(--text-primary)",
                              borderColor: "var(--border-color)"
                            }}
                          />
                          <span className="input-group-text" style={{
                            backgroundColor: "var(--textarea-bg)",
                            color: "var(--text-primary)",
                            borderColor: "var(--border-color)"
                          }}>
                            seconds
                          </span>
                        </div>
                        <small className="text-muted er-timer-text" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                          Custom time: {Math.floor(customTimer / 60)} minutes {customTimer % 60} seconds
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Button to confirm timer */}
                  {selectedTimer ? (
                    <Link href="/escape-room/map" className="btn btn-lg btn-success" style={{ marginBottom: "20px" }}>
                      START GAME
                    </Link>
                  ) : (
                    <button className="btn btn-lg btn-secondary" disabled style={{ marginBottom: "20px" }}>
                      Select Timer First
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Timer selected div - outside the main card */}
            {selectedTimer && (
              <div className="row justify-content-center mt-3">
                <div className="col-md-10">
                  <div className="alert alert-success" style={{
                    backgroundColor: "var(--accent-color)",
                    color: "white",
                    borderColor: "var(--accent-color)"
                  }}>
                    <strong>Timer Selected:</strong> {Math.floor(selectedTimer / 60)} minutes {selectedTimer % 60} seconds
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        

        {gameState === 'playing' && (
          <div className="row justify-content-center" style={{ height: '100%' }}>
            <div className="col-md-10" style={{ height: '100%' }}>
              <div className="card" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Stage {currentStage} of 4</h4>
                  <div className="d-flex gap-3 align-items-center">
                    {/* Timer Display */}
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge" style={{
                        backgroundColor: timeLeft <= 60 ? '#dc3545' : '#55e676',
                        color: 'white',
                        fontSize: '16px',
                        padding: '8px 12px',
                        borderRadius: '20px'
                      }}>
                        ⏱️ {formatTime(timeLeft)}
                      </span>
                    </div>
                    <button 
                      className="btn btn-outline-secondary btn-sm" 
                      onClick={resetGame}
                      style={{
                        color: "var(--text-primary)",
                        borderColor: "var(--border-color)"
                      }}
                    >
                      Back to Menu
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {renderStage()}
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'completed' && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center" style={{ color: "var(--text-primary)" }}>
                <h1 className="display-4 mb-4">🎉 Congratulations!</h1>
                <div className="card" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <div className="card-body">
                    <h2 className="card-title mb-3">Escape Room Completed!</h2>
                  <p className="card-text">
                      You have successfully completed all 4 stages of the escape room challenge!
                    </p>
                    <button 
                      className="btn btn-success"
                      onClick={resetGame}
                    >
                      Play Again
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'timeup' && (
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center" style={{ color: "var(--text-primary)" }}>
                <h1 className="display-4 mb-4">⏰ Time&apos;s Up!</h1>
                <div className="card" style={{
                  backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                  <div className="card-body">
                    <h2 className="card-title mb-3">Challenge Failed</h2>
                    <p className="card-text">
                      You ran out of time! You made it to Stage {currentStage} of 4. 
                      Try again with more time or work faster!
                    </p>
                    <button 
                      className="btn btn-warning"
                      onClick={resetGame}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 