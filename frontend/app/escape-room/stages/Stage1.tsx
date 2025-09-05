'use client';
import { useState } from 'react';

interface Stage1Props {
  onComplete: () => void;
}

const Stage1 = ({ onComplete }: Stage1Props) => {
  const [userCode, setUserCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
  <ul>
    <li>Item 1
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <div clas="container">
    <h2>About Us</h2>
    <p>This is some content without proper spacing and<span class="highlight">highlighted text</span></p>
  </div>
  <footer>
    <p>Copyright 2024</p>
  </footer>
</body>
</html>`);
  const [showHint, setShowHint] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

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
  <div class="container">
    <h2>About Us</h2>
    <p>This is some content without proper spacing and <span class="highlight">highlighted text</span></p>
  </div>
  <footer>
    <p>Copyright 2024</p>
  </footer>
</body>
</html>`;

  const checkFormatting = () => {
    // More detailed formatting check
    const userLines = userCode.split('\n');
    const correctLines = correctCode.split('\n');
    
    // Check if number of lines match
    if (userLines.length !== correctLines.length) {
      setIsAnswerCorrect(false);
      alert('Incorrect formatting. Check your line breaks and structure. Try again or use the hint!');
      return;
    }
    
    // Check each line for proper indentation
    let isCorrect = true;
    for (let i = 0; i < userLines.length; i++) {
      const userLine = userLines[i];
      const correctLine = correctLines[i];
      
      // Remove leading/trailing whitespace for comparison
      const userTrimmed = userLine.trim();
      const correctTrimmed = correctLine.trim();
      
      // Check if the content matches (ignoring indentation)
      if (userTrimmed !== correctTrimmed) {
        isCorrect = false;
        break;
      }
      
      // Check indentation by counting leading spaces
      const userIndent = userLine.length - userLine.trimStart().length;
      const correctIndent = correctLine.length - correctLine.trimStart().length;
      
      if (userIndent !== correctIndent) {
        isCorrect = false;
        break;
      }
    }
    
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
    // Reset code to original malformed version
    setUserCode(`<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
  <ul>
    <li>Item 1
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <div clas="container">
    <h2>About Us</h2>
    <p>This is some content without proper spacing and<span class="highlight">highlighted text</span></p>
  </div>
  <footer>
    <p>Copyright 2024</p>
  </footer>
</body>
</html>`);
  };

  const handleNextStage = () => {
    if (isAnswerCorrect) {
      onComplete();
    }
  };

  return (
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
          <strong>Hint:</strong> Look for these common HTML formatting issues:
          <ul className="mb-0 mt-2">
            <li>Missing closing tags (like &lt;/li&gt; or &lt;/p&gt;)</li>
            <li>Misspelled attributes (like "clas" instead of "class")</li>
            <li>Missing spaces around content</li>
            <li>Proper nesting structure</li>
            <li>All tags should be properly closed</li>
          </ul>
        </div>
      )}

      <div className="d-flex gap-2 flex-wrap">
        {isAnswerCorrect === null ? (
          <>
            <button 
              className="btn btn-primary"
              onClick={checkFormatting}
              style={{
                color: "white",
                backgroundColor: "#007bff",
                borderColor: "#007bff"
              }}
            >
              Submit
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
  );
};

export default Stage1;
