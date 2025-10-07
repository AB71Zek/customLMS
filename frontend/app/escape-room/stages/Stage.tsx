'use client';
import { useState } from 'react';

interface StageProps {
  onEnterRoom: () => void;
}

export default function Stage({ onEnterRoom }: StageProps) {
  const [storyStep, setStoryStep] = useState<number>(0);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/escape-room-misc/treasure-cave.png')",
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 10
      }}
    >
      {/* Story overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'rgba(0,0,0,0.3)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 11
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          border: '3px solid var(--border-color)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 16px 32px rgba(0,0,0,0.4)'
        }}>
          {storyStep === 0 && (
            <>
              <h2 style={{ 
                fontWeight: 800, 
                fontSize: '24px', 
                marginBottom: '16px',
                color: '#333'
              }}>
                The Cave Discovery
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#555',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                After exploring the dense forests, you finally see the cave.
              </p>
              <button
                onClick={() => setStoryStep(1)}
                className="btn btn-primary"
                style={{
                  backgroundColor: '#FFD700',
                  color: '#000',
                  borderColor: '#FFD700',
                  borderWidth: '2px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFC107';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD700';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Next
              </button>
            </>
          )}
          
          {storyStep === 1 && (
            <>
              <h2 style={{ 
                fontWeight: 800, 
                fontSize: '24px', 
                marginBottom: '16px',
                color: '#333'
              }}>
                The Treasure Chest
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#555',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                The treasure chest seems to be situated in a corner. But it has a reading on it.
              </p>
              <button
                onClick={() => setStoryStep(2)}
                className="btn btn-primary"
                style={{
                  backgroundColor: '#FFD700',
                  color: '#000',
                  borderColor: '#FFD700',
                  borderWidth: '2px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFC107';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD700';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Next
              </button>
            </>
          )}
          
          {storyStep === 2 && (
            <>
              <h2 style={{ 
                fontWeight: 800, 
                fontSize: '24px', 
                marginBottom: '16px',
                color: '#333'
              }}>
                The Mysterious Inscription
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#555',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}>
                You approach the chest and read the inscription:
              </p>
              <div style={{
                fontStyle: 'italic',
                fontSize: '20px',
                color: '#8B4513',
                fontWeight: 600,
                backgroundColor: '#fff8dc',
                border: '2px solid #daa520',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                "The true treasure lies outside the vessel, the one inside is earned. Open me if you are meant to be chosen one....."
              </div>
              <button
                onClick={onEnterRoom}
                className="btn btn-success"
                style={{
                  backgroundColor: '#DAA520',
                  color: '#fff',
                  borderColor: '#DAA520',
                  borderWidth: '2px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8860B';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DAA520';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Enter Room
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
