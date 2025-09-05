'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from 'react';
import Footer from '../Components/Footer';
import Header from '../Components/header';
import { useTheme } from '../Components/ThemeContext';

export default function EscapeRoom() {
  const { theme } = useTheme();
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [customTimer, setCustomTimer] = useState<number>(600);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [currentStage, setCurrentStage] = useState(1);
  const [userCode, setUserCode] = useState(`<!DOCTYPE html>
<html>
<head>
<title>My Website</title>
</head>
<body>
<h1>Welcome</h1>
<p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
<ul>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ul>
</body>
</html>`);
  const [showHint, setShowHint] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

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
      setIsAnswerCorrect(null);
      setShowHint(false);
    }
  };

  const correctCode = `<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</body>
</html>`;

  const checkFormatting = () => {
    // Normalize whitespace and compare
    const normalizedUser = userCode.replace(/\s+/g, ' ').trim();
    const normalizedCorrect = correctCode.replace(/\s+/g, ' ').trim();
    
    const isCorrect = normalizedUser === normalizedCorrect;
    setIsAnswerCorrect(isCorrect);
    
    if (isCorrect) {
      alert('Correct! The HTML code is properly formatted. You can proceed to the next stage!');
    } else {
      alert('Incorrect formatting. Check your indentation and spacing. Try again or use the hint!');
    }
  };

  const handleHint = () => {
    setShowHint(true);
  };

  const handleRetry = () => {
    setIsAnswerCorrect(null);
    setShowHint(false);
  };

  const handleNextStage = () => {
    if (isAnswerCorrect) {
      setCurrentStage(2);
      setIsAnswerCorrect(null);
      setShowHint(false);
      // TODO: Set up next stage content
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentStage(1);
    setIsAnswerCorrect(null);
    setShowHint(false);
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

        {gameState === 'playing' && currentStage === 1 && (
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="card" style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)"
              }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Stage 1: HTML Code Formatting</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={resetGame}>
                      Back to Menu
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title mb-3">Format the HTML Code Correctly</h5>
                  <p className="card-text mb-4">
                    The HTML code below has incorrect indentation and formatting. Fix the indentation, spacing, and structure to make it properly formatted.
                  </p>
                  
                  <div className="mb-4">
                    <label className="form-label">Your Code:</label>
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      style={{
                        width: '100%',
                        height: '300px',
                        backgroundColor: 'var(--textarea-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '5px',
                        padding: '15px',
                        fontFamily: 'monospace',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {showHint && (
                    <div className="alert alert-info mb-4" style={{
                      backgroundColor: "var(--textarea-bg)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-color)"
                    }}>
                      <strong>Hint:</strong> Proper HTML formatting includes:
                      <ul className="mb-0 mt-2">
                        <li>Consistent indentation (2 or 4 spaces)</li>
                        <li>Nested elements should be indented more than their parent</li>
                        <li>Proper spacing around tags</li>
                        <li>Clean, readable structure</li>
                      </ul>
                    </div>
                  )}

                  <div className="d-flex gap-2 flex-wrap">
                    {isAnswerCorrect === null ? (
                      <>
                        <button 
                          className="btn btn-primary"
                          onClick={checkFormatting}
                        >
                          Submit
                        </button>
                        <button 
                          className="btn btn-outline-info"
                          onClick={handleHint}
                        >
                          Hint
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn btn-warning"
                          onClick={handleRetry}
                        >
                          Retry
                        </button>
                        <button 
                          className={`btn ${isAnswerCorrect ? 'btn-success' : 'btn-secondary'}`}
                          onClick={handleNextStage}
                          disabled={!isAnswerCorrect}
                        >
                          Next Stage
                        </button>
                      </>
                    )}
                  </div>

                  {isAnswerCorrect !== null && (
                    <div className={`alert mt-3 ${isAnswerCorrect ? 'alert-success' : 'alert-danger'}`} style={{
                      backgroundColor: isAnswerCorrect ? "var(--accent-color)" : "#dc3545",
                      color: "white",
                      borderColor: isAnswerCorrect ? "var(--accent-color)" : "#dc3545"
                    }}>
                      {isAnswerCorrect ? 
                        "✅ Correct! The HTML code is properly formatted." : 
                        "❌ Incorrect formatting. Check your indentation and spacing."
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 