'use client';
import { useState } from 'react';

interface Stage3Props {
  onComplete: () => void;
}

const Stage3 = ({ onComplete }: Stage3Props) => {
  const [clickedItems, setClickedItems] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [gameLost, setGameLost] = useState(false);

  const debugCode = `function calculateSum(numbers) {
  let sum = 0;
  for (let i = 0; i <= numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function reverseString(str) {
  let reversed = "";
  for (let i = str.length; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`;

  const correctedCode = `function calculateSum(numbers) {
  if (numbers.length === 0) return 0; // Added null check
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) { // Fixed: < instead of <=
    sum += numbers[i];
  }
  return sum;
}

function findMax(arr) {
  if (arr.length === 0) return undefined; // Added null check
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function reverseString(str) {
  if (str.length === 0) return ""; // Added null check
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) { // Fixed: str.length - 1
    reversed += str[i];
  }
  return reversed;
}`;

  const debugItems = [
    { 
      id: 1, 
      x: 90, 
      y: 80, 
      isCorrect: false, 
      hint: "Array bounds error - should be < not <=",
      description: "Off-by-one error in loop condition"
    },
    { 
      id: 2, 
      x: 90, 
      y: 120, 
      isCorrect: true, 
      hint: "Missing null check for empty array",
      description: "Should check if array is empty first"
    },
    { 
      id: 3, 
      x: 90, 
      y: 160, 
      isCorrect: false, 
      hint: "String index out of bounds",
      description: "Should start from str.length - 1"
    },
    { 
      id: 4, 
      x: 90, 
      y: 200, 
      isCorrect: true, 
      hint: "Missing error handling",
      description: "Should handle edge cases"
    },
    { 
      id: 5, 
      x: 90, 
      y: 240, 
      isCorrect: true, 
      hint: "Potential division by zero",
      description: "Should check for zero before division"
    }
  ];

  const handleImageClick = (itemId: number) => {
    if (gameLost || isAnswerCorrect) return;
    
    const item = debugItems.find(item => item.id === itemId);
    if (!item) return;

    if (clickedItems.includes(itemId)) return;

    if (!item.isCorrect) {
      // Wrong choice - game lost
      setGameLost(true);
      setIsAnswerCorrect(false);
      alert(`❌ Wrong choice! ${item.description}. Game over - try again!`);
      return;
    }

    // Correct choice - add to clicked items
    const newClickedItems = [...clickedItems, itemId];
    setClickedItems(newClickedItems);
    
    // Check if all correct items are selected
    const correctItems = debugItems.filter(item => item.isCorrect);
    if (newClickedItems.length === correctItems.length) {
      setIsAnswerCorrect(true);
      alert('🎉 Excellent! You found all the bugs correctly!');
    } else {
      alert(`✅ Correct! ${item.description}. Find ${correctItems.length - newClickedItems.length} more bugs.`);
    }
  };

  const handleHint = () => {
    setShowHint(true);
  };

  const handleRetry = () => {
    setClickedItems([]);
    setIsAnswerCorrect(null);
    setGameLost(false);
    setShowHint(false);
  };

  const handleNextStage = () => {
    if (isAnswerCorrect) {
      onComplete();
    }
  };

  const correctItems = debugItems.filter(item => item.isCorrect);
  const progress = clickedItems.length;

  return (
    <div className="card-body">
      <h5 className="card-title mb-3">Stage 3: Debug Code by Clicking</h5>
      <p className="card-text mb-4">
        Click on the areas in the code that contain bugs. You need to find all {correctItems.length} bugs to proceed.
        <strong> Warning:</strong> Clicking on incorrect areas will end the challenge!
      </p>
      
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="form-label mb-0">Debug Points Found: {progress}/{correctItems.length}</label>
          <div className="progress" style={{ width: '200px', height: '20px' }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${(progress / correctItems.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h6>Bugged Code</h6>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <pre style={{
              backgroundColor: 'var(--code-bg)',
              color: 'var(--text-primary)',
              padding: '20px',
              borderRadius: '5px',
              position: 'relative',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              border: '2px solid var(--border-color)'
            }}>
              {debugCode}
            </pre>
            
            {/* Debug clickable areas */}
            {debugItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item.id)}
                style={{
                  position: 'absolute',
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: '25px',
                  height: '25px',
                  backgroundColor: clickedItems.includes(item.id) ? '#28a745' : 
                                 gameLost ? '#dc3545' : '#dc3545',
                  borderRadius: '50%',
                  cursor: gameLost || isAnswerCorrect ? 'not-allowed' : 'pointer',
                  border: '3px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  opacity: gameLost && !clickedItems.includes(item.id) ? 0.3 : 1
                }}
                title={item.description}
              >
                {clickedItems.includes(item.id) ? '✓' : 
                 gameLost ? '✗' : '?'}
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-md-6">
          <h6>Corrected Code</h6>
          <div style={{ marginBottom: '20px' }}>
            <pre style={{
              backgroundColor: 'var(--code-bg)',
              color: 'var(--text-primary)',
              padding: '20px',
              borderRadius: '5px',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              border: '2px solid var(--border-color)'
            }}>
              {isAnswerCorrect ? correctedCode : 'Complete the debugging to see the corrected code...'}
            </pre>
          </div>
        </div>
      </div>

      {showHint && (
        <div className="alert alert-info mb-4" style={{
          backgroundColor: "var(--textarea-bg)",
          color: "var(--text-primary)",
          borderColor: "var(--border-color)"
        }}>
          <strong>Hint:</strong> Look for these common bugs:
          <ul className="mb-0 mt-2">
            <li>Off-by-one errors in loop conditions</li>
            <li>Array bounds issues (accessing out of range)</li>
            <li>Missing null/undefined checks</li>
            <li>String indexing problems</li>
            <li>Missing error handling</li>
          </ul>
        </div>
      )}

      <div className="d-flex gap-2 flex-wrap">
        {!gameLost && !isAnswerCorrect && (
          <>
            <button 
              className="btn btn-outline-info"
              onClick={handleHint}
              style={{
                color: "var(--text-primary)",
                borderColor: "#17a2b8"
              }}
            >
              Hint
            </button>
          </>
        )}

        {(gameLost || isAnswerCorrect) && (
          <>
            <button 
              className="btn btn-warning"
              onClick={handleRetry}
              style={{
                color: "var(--text-primary)",
                backgroundColor: "#ffc107",
                borderColor: "#ffc107"
              }}
            >
              Retry
            </button>
            <button 
              className={`btn ${isAnswerCorrect ? 'btn-success' : 'btn-secondary'}`}
              onClick={handleNextStage}
              disabled={!isAnswerCorrect}
              style={{
                color: isAnswerCorrect ? "white" : "var(--text-primary)",
                backgroundColor: isAnswerCorrect ? "#28a745" : "#6c757d",
                borderColor: isAnswerCorrect ? "#28a745" : "#6c757d"
              }}
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
            "🎉 Perfect! You found all the bugs correctly!" : 
            "❌ Game over! You clicked on an incorrect area. Try again!"
          }
        </div>
      )}
    </div>
  );
};

export default Stage3;
