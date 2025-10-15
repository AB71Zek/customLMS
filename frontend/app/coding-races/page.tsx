'use client';

import Header from '../Components/header';

export default function CodingRaces() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header studentNumber="21406232" />
      
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h1 style={{ color: '#2c3e50', marginBottom: '30px', textAlign: 'center' }}>
                🏁 Coding Races
              </h1>
              
              <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
                <p style={{ marginBottom: '20px' }}>
                  Challenge yourself and compete with other students in fast-paced coding competitions. 
                  Solve algorithmic problems under time pressure and climb the leaderboard!
                </p>
                
                <div style={{
                  backgroundColor: '#fff3cd',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #ffeaa7',
                  marginBottom: '30px'
                }}>
                  <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                    🚧 Coming Soon
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    The Coding Races feature is currently under development. 
                    Stay tuned for exciting competitive programming challenges!
                  </p>
                </div>
                
                <h3 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '15px' }}>
                  🎯 What to Expect
                </h3>
                <ul style={{ marginBottom: '20px' }}>
                  <li><strong>Algorithm Challenges:</strong> Solve complex problems step by step</li>
                  <li><strong>Time-based Competitions:</strong> Race against the clock</li>
                  <li><strong>Leaderboards:</strong> Compete with peers globally</li>
                  <li><strong>Multiple Languages:</strong> Support for various programming languages</li>
                  <li><strong>Real-time Feedback:</strong> Instant results and explanations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
