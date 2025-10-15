'use client';

import Header from '../Components/header';

export default function CourtRoom() {
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
                ⚖️ Court Room
              </h1>
              
              <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
                <p style={{ marginBottom: '20px' }}>
                  Practice your argumentation and debate skills in our virtual courtroom. 
                  Present cases, cross-examine witnesses, and develop critical thinking abilities 
                  through interactive legal scenarios.
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
                    The Court Room feature is currently under development. 
                    Prepare for engaging legal debates and argumentation practice!
                  </p>
                </div>
                
                <h3 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '15px' }}>
                  🎯 What to Expect
                </h3>
                <ul style={{ marginBottom: '20px' }}>
                  <li><strong>Mock Trials:</strong> Participate in simulated court proceedings</li>
                  <li><strong>Case Studies:</strong> Analyze real-world legal scenarios</li>
                  <li><strong>Debate Practice:</strong> Hone your argumentation skills</li>
                  <li><strong>Role Playing:</strong> Take on different legal roles</li>
                  <li><strong>Peer Evaluation:</strong> Learn from fellow students</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
