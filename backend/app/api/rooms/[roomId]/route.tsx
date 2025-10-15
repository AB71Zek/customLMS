import { trace } from '@opentelemetry/api';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  return await trace
    .getTracer('custom-lms-backend')
    .startActiveSpan('get-room-by-id', async (span) => {
      try {
        const roomId = params.roomId;

        const room = await prisma.room.findUnique({
          where: {
            roomId: roomId,
          },
        });

        if (!room) {
          span.setStatus({ code: 2, message: 'Room not found' });
          return NextResponse.json(
            { error: 'Room not found' },
            { status: 404 }
          );
        }

        span.setAttributes({
          'room.id': room.id,
          'room.roomId': room.roomId,
          'room.createdBy': room.createdBy
        });

        return NextResponse.json(room);
      } catch (error) {
        span.setStatus({ code: 2, message: 'Failed to fetch room' });
        console.error('Error fetching room:', error);
        return NextResponse.json(
          { error: 'Failed to fetch room' },
          { status: 500 }
        );
      } finally {
        span.end();
      }
    });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  return await trace
    .getTracer('custom-lms-backend')
    .startActiveSpan('update-room', async (span) => {
      try {
        const roomId = params.roomId;
        const body = await request.json();
        const { iconLayout, questions } = body;

        const room = await prisma.room.update({
          where: {
            roomId: roomId,
          },
          data: {
            iconLayout: iconLayout ? JSON.stringify(iconLayout) : undefined,
            questions: questions ? JSON.stringify(questions) : undefined,
          },
        });

        span.setAttributes({
          'room.id': room.id,
          'room.roomId': room.roomId,
          'room.updated': true
        });

        return NextResponse.json(room);
      } catch (error) {
        span.setStatus({ code: 2, message: 'Failed to update room' });
        console.error('Error updating room:', error);
        return NextResponse.json(
          { error: 'Failed to update room' },
          { status: 500 }
        );
      } finally {
        span.end();
      }
    });
}
