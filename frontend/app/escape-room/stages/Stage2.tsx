'use client';
import { useState } from 'react';

interface Stage2Props {
  onComplete: () => void;
}

const Stage2 = ({ onComplete }: Stage2Props) => {
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const runCode = () => {
    if (!userCode.trim()) {
      setOutput('Please enter some code first.');
      return;
    }
    
    try {
      // Create a safe execution environment
      const func = new Function(userCode);
      const result = func();
      
      if (result === undefined) {
        setOutput('Your code did not return anything. Make sure to use "return" statement.');
        return;
      }
      
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkNumbers = () => {
    if (!userCode.trim()) {
      setIsAnswerCorrect(false);
      alert('Please enter some code first.');
      return;
    }
    
    try {
      const func = new Function(userCode);
      const result = func();
      
      if (result === undefined) {
        setIsAnswerCorrect(false);
        alert('Your code did not return anything. Make sure to use "return" statement.');
        return;
      }
      
      if (Array.isArray(result) && result.length === 101) {
        const expected = Array.from({ length: 101 }, (_, i) => i);
        const isCorrect = expected.every((num, index) => result[index] === num);
        
        if (isCorrect) {
          setIsAnswerCorrect(true);
          alert('Perfect! You generated all numbers from 0 to 100. Moving to next stage...');
        } else {
          setIsAnswerCorrect(false);
          alert('Numbers are not in the correct sequence or range.');
        }
      } else {
        setIsAnswerCorrect(false);
        alert('Your code should return an array with 101 numbers (0 to 100).');
      }
    } catch (error) {
      setIsAnswerCorrect(false);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleHint = () => {
    setShowHint(true);
  };

  const handleRetry = () => {
    setIsAnswerCorrect(null);
    setShowHint(false);
    setUserCode('');
    setOutput('');
  };

  const handleNextStage = () => {
    if (isAnswerCorrect) {
      onComplete();
    }
  };

  return (
    <div className="card-body">
      <h5 className="card-title mb-3">Stage 2: Generate Numbers 0-100</h5>
      <p className="card-text mb-4">
        Write JavaScript code that generates all numbers from 0 to 100 and returns them as an array.
      </p>
      
      <div className="mb-4">
        <label className="form-label">Your Code:</label>
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="// Write your code here
// Example: return Array.from({length: 101}, (_, i) => i);"
          style={{
            width: '100%',
            height: '150px',
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
          <strong>Hint:</strong> Here are some approaches you can use:
          <ul className="mb-0 mt-2">
            <li><code>Array.from({'{'}length: 101{'}'}, (_, i) =&gt; i)</code></li>
            <li><code>[...Array(101).keys()]</code></li>
            <li>Use a for loop to build the array</li>
            <li>Make sure to return the array, not just log it</li>
          </ul>
        </div>
      )}

      <div className="d-flex gap-2 flex-wrap mb-3">
        {isAnswerCorrect === null ? (
          <>
            <button 
              className="btn btn-outline-primary"
              onClick={runCode}
              style={{
                color: "var(--text-primary)",
                borderColor: "#007bff"
              }}
            >
              Run Code
            </button>
            <button 
              className="btn btn-primary"
              onClick={checkNumbers}
              style={{
                color: "white",
                backgroundColor: "#007bff",
                borderColor: "#007bff"
              }}
            >
              Check Solution
            </button>
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
        ) : (
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

      {output && (
        <div className="mb-4">
          <label className="form-label">Output:</label>
          <div style={{
            backgroundColor: 'var(--code-bg)',
            color: 'var(--text-primary)',
            padding: '15px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxHeight: '150px',
            overflowY: 'auto',
            border: '1px solid var(--border-color)'
          }}>
            {output.length > 500 ? `${output.substring(0, 500)}...` : output}
          </div>
        </div>
      )}

      {isAnswerCorrect !== null && (
        <div className={`alert ${isAnswerCorrect ? 'alert-success' : 'alert-danger'}`} style={{
          backgroundColor: isAnswerCorrect ? "var(--accent-color)" : "#dc3545",
          color: "white",
          borderColor: isAnswerCorrect ? "var(--accent-color)" : "#dc3545"
        }}>
          {isAnswerCorrect ? 
            "✅ Correct! You generated all numbers from 0 to 100." : 
            "❌ Incorrect. Check your code and try again."
          }
        </div>
      )}
    </div>
  );
};

export default Stage2;
