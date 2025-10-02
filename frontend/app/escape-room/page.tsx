'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import Link from 'next/link';
import { useState } from 'react';
import Header from '../Components/header';
import { useTheme } from '../Components/ThemeContext';
// Stage components removed; map flow starts on /escape-room/map

export default function EscapeRoom() {
  const { theme } = useTheme();
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [customTimer, setCustomTimer] = useState<number>(600);
  // Game state removed; this page only selects timer and links to map

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

  // Removed stage flow helpers

  // Removed in favor of editor-driven map experience

  return (
    <div className="container theme-transition escape-room" style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0" }} data-theme={theme}>
      <Header studentNumber="21406232" />

      <div style={{ marginTop: "133px", marginBottom: "20px"}}>
        {
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
                    <Link href={`/escape-room/map?timer=${selectedTimer}`} className="btn btn-lg btn-success" style={{ marginBottom: "20px" }}>
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
        }
        {/* Stage playing/completion/timeup views removed */}
      </div>
    </div>
  );
} 