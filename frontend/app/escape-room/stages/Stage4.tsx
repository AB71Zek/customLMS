'use client';
import { useState } from 'react';

interface Stage4Props {
  onComplete: () => void;
}

const Stage4 = ({ onComplete }: Stage4Props) => {
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  const inputData = `[
  {"name": "John", "age": 30, "city": "New York"},
  {"name": "Jane", "age": 25, "city": "Los Angeles"},
  {"name": "Bob", "age": 35, "city": "Chicago"}
]`;

  const expectedOutput = `name,age,city
John,30,New York
Jane,25,Los Angeles
Bob,35,Chicago`;

  const runCode = () => {
    try {
      if (!userCode.trim()) {
        setOutput('Error: Please write some code first');
        return;
      }

      // Create a function that takes the input data and returns the result
      const func = new Function('data', userCode);
      const result = func(JSON.parse(inputData));
      
      if (result === undefined) {
        setOutput('Error: Your function must return a value');
        return;
      }

      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkCSV = () => {
    try {
      if (!userCode.trim()) {
        setOutput('Error: Please write some code first');
        return;
      }

      const func = new Function('data', userCode);
      const result = func(JSON.parse(inputData));
      
      if (result === undefined) {
        setOutput('Error: Your function must return a value');
        return;
      }

      // Check if result is a string (CSV format)
      if (typeof result !== 'string') {
        setOutput('Error: Your function should return a CSV string');
        return;
      }

      // Normalize the result and expected output for comparison
      const normalizedResult = result.trim().replace(/\r\n/g, '\n');
      const normalizedExpected = expectedOutput.trim().replace(/\r\n/g, '\n');
      
      if (normalizedResult === normalizedExpected) {
        setIsAnswerCorrect(true);
        setOutput('✅ Correct! Your CSV conversion is perfect!');
      } else {
        setIsAnswerCorrect(false);
        setOutput(`❌ Incorrect. Expected:\n${expectedOutput}\n\nYour output:\n${result}`);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsAnswerCorrect(false);
    }
  };

  const handleHint = () => {
    setShowHint(!showHint);
  };

  const handleRetry = () => {
    setUserCode('');
    setOutput('');
    setIsAnswerCorrect(null);
    setShowHint(false);
  };

  const handleNextStage = () => {
    if (isAnswerCorrect) {
      onComplete();
    }
  };

  return (
    <div className="card-body">
      <h5 className="card-title mb-3">Stage 4: Data Porting - JSON to CSV</h5>
      <p className="card-text mb-4">
        Write a JavaScript function that converts the JSON data below into CSV format. 
        Your function should take the data as a parameter and return a CSV string.
      </p>

      <div className="row mb-4">
        <div className="col-md-6">
          <h6>Input Data (JSON)</h6>
          <pre style={{
            backgroundColor: 'var(--code-bg)',
            color: 'var(--text-primary)',
            padding: '15px',
            borderRadius: '5px',
            fontSize: '12px',
            border: '2px solid var(--border-color)'
          }}>
            {inputData}
          </pre>
        </div>
        <div className="col-md-6">
          <h6>Expected Output (CSV)</h6>
          <pre style={{
            backgroundColor: 'var(--code-bg)',
            color: 'var(--text-primary)',
            padding: '15px',
            borderRadius: '5px',
            fontSize: '12px',
            border: '2px solid var(--border-color)'
          }}>
            {expectedOutput}
          </pre>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Your JavaScript Code:</label>
        <textarea
          className="form-control"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="// Write your function here
// Example: return data.map(item => ...).join('\n');"
          rows={8}
          style={{
            backgroundColor: 'var(--textarea-bg)',
            color: 'var(--text-primary)',
            border: '2px solid var(--border-color)',
            fontFamily: 'monospace'
          }}
        />
      </div>

      <div className="mb-3">
        <button 
          className="btn btn-secondary me-2"
          onClick={runCode}
          style={{
            color: 'white',
            backgroundColor: 'var(--secondary-color)',
            borderColor: 'var(--secondary-color)'
          }}
        >
          Run Code
        </button>
        <button 
          className="btn btn-warning me-2"
          onClick={checkCSV}
          style={{
            color: 'white',
            backgroundColor: 'var(--warning-color)',
            borderColor: 'var(--warning-color)'
          }}
        >
          Check Solution
        </button>
        <button 
          className="btn btn-info me-2"
          onClick={handleHint}
          style={{
            color: 'white',
            backgroundColor: 'var(--info-color)',
            borderColor: 'var(--info-color)'
          }}
        >
          Hint
        </button>
      </div>

      {output && (
        <div className="mb-3">
          <label className="form-label">Output:</label>
          <pre style={{
            backgroundColor: 'var(--code-bg)',
            color: 'var(--text-primary)',
            padding: '15px',
            borderRadius: '5px',
            fontSize: '12px',
            border: '2px solid var(--border-color)',
            whiteSpace: 'pre-wrap'
          }}>
            {output}
          </pre>
        </div>
      )}

      {showHint && (
        <div className="alert alert-info mb-4" style={{
          backgroundColor: "var(--textarea-bg)",
          color: "var(--text-primary)",
          border: "2px solid var(--border-color)"
        }}>
          <h6>💡 Hint:</h6>
          <ul className="mb-0">
            <li>Use <code>Object.keys()</code> to get the headers from the first object</li>
            <li>Use <code>map()</code> to convert each object to a CSV row</li>
            <li>Use <code>join()</code> to combine headers and rows with newlines</li>
            <li>Example: <code>const headers = Object.keys(data[0]);</code></li>
            <li>Example: <code>const rows = data.map(item =&gt; headers.map(key =&gt; item[key]).join(&apos;,&apos;));</code></li>
          </ul>
        </div>
      )}

      <div className="d-flex gap-2">
        {isAnswerCorrect !== null && (
          <>
            <button 
              className="btn btn-secondary"
              onClick={handleRetry}
              style={{
                color: 'white',
                backgroundColor: 'var(--secondary-color)',
                borderColor: 'var(--secondary-color)'
              }}
            >
              Retry
            </button>
            <button 
              className="btn btn-success"
              onClick={handleNextStage}
              disabled={!isAnswerCorrect}
              style={{
                color: 'white',
                backgroundColor: isAnswerCorrect ? 'var(--success-color)' : 'var(--secondary-color)',
                borderColor: isAnswerCorrect ? 'var(--success-color)' : 'var(--secondary-color)'
              }}
            >
              Next Stage
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Stage4;