import { prisma } from '@/lib/prisma';
import { trace } from '@opentelemetry/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return await trace
    .getTracer('custom-lms-backend')
    .startActiveSpan('create-user', async (span) => {
      try {
        const body = await request.json();
        const { name, email } = body;

        if (!name || !email) {
          span.setStatus({ code: 2, message: 'Missing required fields' });
          return NextResponse.json(
            { error: 'Name and email are required' },
            { status: 400 }
          );
        }

        const user = await prisma.user.create({
          data: {
            name,
            email,
          },
        });

        span.setAttributes({
          'user.id': user.id,
          'user.email': user.email,
          'user.name': user.name
        });

        return NextResponse.json(user, { status: 201 });
      } catch (error) {
        span.setStatus({ code: 2, message: 'Failed to create user' });
        console.error('Error creating user:', error);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      } finally {
        span.end();
      }
    });
}

export async function GET() {
  return await trace
    .getTracer('custom-lms-backend')
    .startActiveSpan('fetch-users', async (span) => {
      try {
        const users = await prisma.user.findMany();
        
        span.setAttributes({
          'users.count': users.length
        });

        return NextResponse.json(users);
      } catch (error) {
        span.setStatus({ code: 2, message: 'Failed to fetch users' });
        console.error('Error fetching users:', error);
        return NextResponse.json(
          { error: 'Failed to fetch users' },
          { status: 500 }
        );
      } finally {
        span.end();
      }
    });
}