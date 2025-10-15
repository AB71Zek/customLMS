import { prisma } from '@/lib/prisma';
import { trace } from '@opentelemetry/api';
import { NextRequest, NextResponse } from 'next/server';

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(request: NextRequest) {
  return await trace
    .getTracer('custom-lms-backend')
    .startActiveSpan('create-room', async (span) => {
      try {
        const body = await request.json();
        const { iconLayout, questions, createdBy } = body;

        if (!iconLayout || !questions || !createdBy) {
          span.setStatus({ code: 2, message: 'Missing required fields' });
          return NextResponse.json(
            { error: 'iconLayout, questions, and createdBy are required' },
            { status: 400 }
          );
        }

        const room = await prisma.room.create({
          data: {
            roomId: generateRoomId(),
            iconLayout,
            questions,
            createdBy,
          },
        });

        span.setAttributes({
          'room.id': room.id,
          'room.roomId': room.roomId,
          'room.createdBy': room.createdBy,
          'room.iconsCount': Array.isArray(iconLayout) ? iconLayout.length : 0,
          'room.questionsCount': Array.isArray(questions) ? questions.length : 0
        });

        return NextResponse.json(room, { status: 201 });
      } catch (error) {
        span.setStatus({ code: 2, message: 'Failed to create room' });
        console.error('Error creating room:', error);
        return NextResponse.json(
          { error: 'Failed to create room' },
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
    .startActiveSpan('fetch-rooms', async (span) => {
      try {
        const rooms = await prisma.room.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });

        span.setAttributes({
          'rooms.count': rooms.length
        });

        return NextResponse.json(rooms);
      } catch (error) {
        span.setStatus({ code: 2, message: 'Failed to fetch rooms' });
        console.error('Error fetching rooms:', error);
        return NextResponse.json(
          { error: 'Failed to fetch rooms' },
          { status: 500 }
        );
      } finally {
        span.end();
      }
    });
}