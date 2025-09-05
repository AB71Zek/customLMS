'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from 'react';
import Footer from '../Components/Footer';
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
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [currentStage, setCurrentStage] = useState(1);

  const timerOptions = [
    { value: 300, label: "5 minutes", description: "Quick challenge" },
    { value: 600, label: "10 minutes", description: "Recommended" },
    { value: 900, label: "15 minutes", description: "Extended time" },
    { value: 1200, label: "20 minutes", description: "Maximum time" }
  ];

  const handleTimerSelect = (timerValue: number) => {
    setSelectedTimer(timerValue);
  };

  const handleCustomTimerChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 60 && numValue <= 1800) {
      setCustomTimer(numValue);
      setSelectedTimer(numValue);
    }
  };

  const handleStartChallenge = () => {
    if (selectedTimer) {
      setGameState('playing');
      setCurrentStage(1);
    }
  };

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

  return (
    <div className="container theme-transition" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", minHeight: "100vh", marginBottom: "60px" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ marginTop: "133px" }}>
        {gameState === 'menu' && (
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center" style={{ color: "var(--text-primary)" }}>
                <h1 className="display-4 mb-4">Escape Room</h1>
                
                {/* Challenge Overview Card */}
                <div className="card mb-4" style={{
                  backgroundColor: "var(--section-bg)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)"
                }}>
                  <div className="card-body">
                    <h2 className="card-title mb-3">Challenge Overview</h2>
                    <p className="card-text">
                      This escape room features multiple puzzles, hidden clues, and interactive elements. 
                      Work through each challenge systematically to find your way out.
                    </p>
                    <button 
                      className={`btn ${selectedTimer ? 'btn-success' : 'btn-secondary'}`}
                      onClick={handleStartChallenge}
                      disabled={!selectedTimer}
                    >
                      {selectedTimer ? `Start Challenge (${Math.floor(selectedTimer / 60)} min)` : 'Select Timer First'}
                    </button>
                  </div>
                </div>
                
                {/* Timer Selection Card */}
                <div className="card mb-4" style={{
                  backgroundColor: "var(--section-bg)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)"
                }}>
                  <div className="card-body">
                    <h2 className="card-title mb-3">Select Timer Duration</h2>
                    <p className="card-text mb-4">
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
                              color: selectedTimer === option.value ? "white" : "var(--text-primary)",
                              cursor: "pointer",
                              border: selectedTimer === option.value ? "2px solid var(--accent-color)" : "1px solid var(--border-color)"
                            }}
                            onClick={() => handleTimerSelect(option.value)}
                          >
                            <div className="card-body text-center">
                              <h5 className="card-title">{option.label}</h5>
                              <p className="card-text small">{option.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Custom Timer Option */}
                    <div className="row">
                      <div className="col-md-8 mx-auto">
                        <label className="form-label">Or set custom time (60-1800 seconds):</label>
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
                        <small className="text-muted">
                          Custom time: {Math.floor(customTimer / 60)} minutes {customTimer % 60} seconds
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                {selectedTimer && (
                  <div className="alert alert-success" style={{
                    backgroundColor: "var(--accent-color)",
                    color: "white",
                    borderColor: "var(--accent-color)"
                  }}>
                    <strong>Timer Selected:</strong> {Math.floor(selectedTimer / 60)} minutes {selectedTimer % 60} seconds
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="card" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Stage {currentStage} of 4</h4>
                  <div className="d-flex gap-2">
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
                {renderStage()}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 