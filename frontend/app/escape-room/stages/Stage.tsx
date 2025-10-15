'use client';
import { useState } from 'react';

interface StageProps {
  onEnterRoom: (timerSeconds: number) => void;
}

export default function Stage({ onEnterRoom }: StageProps) {
  // Timer states
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [customSeconds, setCustomSeconds] = useState<string>('');
  const [timerError, setTimerError] = useState<string>('');

  // Timer presets
  const timerPresets = [
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
    { label: '15 minutes', value: 900 }
  ];

  // Timer functions
  const handlePresetSelect = (value: number) => {
    setSelectedTimer(value);
    setCustomSeconds('');
    setTimerError('');
  };

  const handleCustomChange = (value: string) => {
    setCustomSeconds(value);
    setSelectedTimer(null);
    setTimerError('');
  };

  const handleStartTimer = () => {
    let seconds: number;

    if (selectedTimer) {
      seconds = selectedTimer;
    } else if (customSeconds) {
      seconds = parseInt(customSeconds);
      if (isNaN(seconds) || seconds < 60 || seconds > 900) {
        setTimerError('Must be 60-900 secs');
        return;
      }
    } else {
      setTimerError('Select a timer');
      return;
    }

    onEnterRoom(seconds);
  };
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/escape-room-misc/stage4-bg.png')",
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 10,
        border: '3px solid #dc3545',
        borderRadius: '8px'
      }}
    >
      {/* Story overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'rgba(0,0,0,0.3)', 
        zIndex: 11
      }}>
        {/* Complete story text */}
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '1000px',
          textAlign: 'center',
          padding: '0 20px'
        }}>
          <p style={{
            fontSize: '32px',
            color: '#FFE4B5',
            margin: '0 0 30px 0',
            lineHeight: '1.4',
            fontWeight: 700
          }}>
            After exploring the dense forests, you finally see the cave.
          </p>
          
          <p style={{
            fontSize: '28px',
            color: '#FFE4B5',
            margin: '0 0 30px 0',
            lineHeight: '1.4',
            fontWeight: 700
          }}>
            The treasure chest seems to be situated in a corner. But it has a reading on it.
          </p>
          
          <p style={{
            fontStyle: 'italic',
            fontSize: '24px',
            color: '#FFE4B5',
            fontWeight: 700,
            margin: '0 0 40px 0',
            lineHeight: '1.4'
          }}>
            &quot;The true treasure lies outside the vessel, the one inside is earned. Open me if you are meant to be chosen one.....&quot;
          </p>
        </div>

        {/* Timer Selection - Compact Dropdown */}
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '50px',
          zIndex: 12
        }}>
          <div style={{
            backgroundColor: 'rgba(210, 180, 140, 0.7)',
            border: '2px solid #dc3545',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: '280px',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#2c1810',
                margin: 0
              }}>
                ⏰ Timer
              </h4>
            </div>

            {/* Preset Options - Compact */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {timerPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    style={{
                      backgroundColor: selectedTimer === preset.value ? '#dc3545' : 'rgba(255, 255, 255, 0.8)',
                      color: selectedTimer === preset.value ? '#ffffff' : '#2c1810',
                      border: `1px solid ${selectedTimer === preset.value ? '#dc3545' : '#8b7355'}`,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flex: 1,
                      minWidth: '70px'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTimer !== preset.value) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTimer !== preset.value) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                      }
                    }}
                  >
                    {preset.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input - Compact */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  value={customSeconds}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  placeholder="Custom (60-900)"
                  min="60"
                  max="900"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: `1px solid ${customSeconds ? '#dc3545' : '#8b7355'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#2c1810'
                  }}
                />
                <span style={{
                  fontSize: '12px',
                  color: '#2c1810',
                  whiteSpace: 'nowrap'
                }}>
                  sec
                </span>
              </div>
            </div>

            {/* Error Message - Compact */}
            {timerError && (
              <div style={{
                backgroundColor: 'rgba(248, 215, 218, 0.9)',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                color: '#721c24',
                fontSize: '10px',
                padding: '4px 6px',
                marginBottom: '8px',
                textAlign: 'center',
                maxHeight: '20px',
                overflow: 'hidden',
                lineHeight: '1.2'
              }}>
                {timerError}
              </div>
            )}

            {/* Start Button - Yellow Enter Room Style */}
            <button
              onClick={handleStartTimer}
              className="btn btn-success"
              style={{
                width: '100%',
                backgroundColor: '#DAA520',
                color: '#fff',
                borderColor: '#DAA520',
                borderWidth: '2px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B8860B';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DAA520';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}
            >
              Enter Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
