'use client';

import { trace } from '@opentelemetry/api';
import React, { useEffect, useState } from 'react';

const getPathUrl = () => {
  if (typeof window !== 'undefined') {
    return new URL(window.location.href).origin.replace(/\/$/, '');
  }
  return ''; // Fallback for SSR
};

const BackendDashboard: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalUsers: 0,
    activeRooms: 0
  });

  useEffect(() => {
    setBaseUrl(getPathUrl());
    // Fetch basic stats with OpenTelemetry tracing
    fetchStats();
  }, []);

  const fetchStats = async () => {
    return await trace
      .getTracer('custom-lms-frontend')
      .startActiveSpan('fetch-backend-stats', async (span) => {
        try {
          const [roomsRes, usersRes] = await Promise.all([
            fetch(`${baseUrl}/api/rooms`),
            fetch(`${baseUrl}/api/users`)
          ]);
          
          const rooms = await roomsRes.json();
          const users = await usersRes.json();
          
          setStats({
            totalRooms: rooms.length || 0,
            totalUsers: users.length || 0,
            activeRooms: rooms.filter((room: any) => 
              new Date(room.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            ).length || 0
          });

          span.setAttributes({
            'stats.totalRooms': rooms.length || 0,
            'stats.totalUsers': users.length || 0,
            'stats.activeRooms': rooms.filter((room: any) => 
              new Date(room.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            ).length || 0
          });
        } catch (error) {
          span.setStatus({ code: 2, message: 'Failed to fetch stats' });
          console.error('Error fetching stats:', error);
        } finally {
          span.end();
        }
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>
            🏰 Custom LMS Escape Room Backend
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '1.2rem' }}>
            Server Status: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>● Online</span>
          </p>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem' }}>
            🔍 OpenTelemetry Instrumentation Active
          </p>
        </header>

        {/* Stats Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>Total Rooms</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#2c3e50' }}>{stats.totalRooms}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#3498db', margin: '0 0 10px 0' }}>Total Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#2c3e50' }}>{stats.totalUsers}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#f39c12', margin: '0 0 10px 0' }}>Active Rooms (24h)</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#2c3e50' }}>{stats.activeRooms}</p>
          </div>
        </div>

        {/* API Documentation */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>API Documentation</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
            <strong>GET, POST, PUT</strong> requests to{' '}
            <code style={{ backgroundColor: '#ecf0f1', padding: '2px 6px', borderRadius: '4px' }}>{baseUrl}/api</code> endpoints for managing escape rooms and users.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#e74c3c' }}>Users API</h3>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li style={{ marginBottom: '8px' }}>
                  <code style={{ backgroundColor: '#ecf0f1', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                    GET /api/users
                  </code>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <code style={{ backgroundColor: '#ecf0f1', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                    POST /api/users
                  </code>
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ color: '#3498db' }}>Rooms API</h3>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li style={{ marginBottom: '8px' }}>
                  <code style={{ backgroundColor: '#ecf0f1', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                    GET /api/rooms
                  </code>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <code style={{ backgroundColor: '#ecf0f1', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                    POST /api/rooms
                  </code>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <code style={{ backgroundColor: '#ecf0f1', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                    GET /api/rooms/[roomId]
                  </code>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <code style={{ backgroundColor: '#ecf0f1', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                    PUT /api/rooms/[roomId]
                  </code>
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ color: '#f39c12' }}>Play API</h3>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li style={{ marginBottom: '8px' }}>
                  <code style={{ backgroundColor: '#ecf0f1', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                    GET /api/play/[roomId]
                  </code>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Quick Test</h4>
            <p style={{ marginBottom: '10px' }}>Test the API with curl:</p>
            <pre style={{ backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
              <code>{`curl -X GET ${baseUrl}/api/rooms`}</code>
            </pre>
          </div>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '40px', color: '#7f8c8d' }}>
          <p>Custom LMS Escape Room Backend • Built with Next.js, Prisma & OpenTelemetry</p>
        </footer>
      </div>
    </div>
  );
};

export default BackendDashboard;
