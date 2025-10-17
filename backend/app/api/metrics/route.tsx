import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Simple metrics endpoint that returns basic application metrics
  const metrics = {
    timestamp: new Date().toISOString(),
    service: 'customlms-backend',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    status: 'healthy'
  };

  return NextResponse.json(metrics, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
