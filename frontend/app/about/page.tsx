'use client';

import Header from '../Components/header';

export default function About() {
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
                🏰 About Custom LMS
              </h1>
              
              <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
                <p style={{ marginBottom: '20px' }}>
                  Welcome to the Custom Learning Management System - an innovative platform designed 
                  to make learning interactive, engaging, and fun through gamified experiences.
                </p>
                
                <h3 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '15px' }}>
                  🎯 Our Mission
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  We believe that learning should be an adventure. Our platform transforms traditional 
                  educational content into immersive experiences that challenge students while making 
                  learning enjoyable and memorable.
                </p>
                
                <h3 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '15px' }}>
                  🚀 Features
                </h3>
                <ul style={{ marginBottom: '20px' }}>
                  <li><strong>Escape Rooms:</strong> Interactive puzzle-solving experiences</li>
                  <li><strong>Coding Races:</strong> Competitive programming challenges</li>
                  <li><strong>Court Room:</strong> Debate and argumentation practice</li>
                  <li><strong>Real-time Analytics:</strong> Track progress and performance</li>
                  <li><strong>OpenTelemetry Integration:</strong> Advanced monitoring and insights</li>
                </ul>
                
                <h3 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '15px' }}>
                  🛠️ Technology Stack
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  Built with modern technologies including Next.js, React, Bootstrap, Prisma, 
                  PostgreSQL, and OpenTelemetry for comprehensive observability.
                </p>
                
                <div style={{
                  backgroundColor: '#e3f2fd',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #2196f3',
                  marginTop: '30px'
                }}>
                  <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>
                    🔍 OpenTelemetry Instrumentation
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    Our platform includes comprehensive instrumentation for monitoring performance, 
                    tracking user interactions, and providing detailed analytics for educators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
