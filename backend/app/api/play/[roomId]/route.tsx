import { prisma } from '@/lib/prisma';
import { trace } from '@opentelemetry/api';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request
) {
  return await trace
    .getTracer('custom-lms-backend')
    .startActiveSpan('play-room', async (span) => {
      try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/');
        const roomIndex = parts.findIndex((p) => p === 'play');
        const roomId = roomIndex >= 0 ? parts[roomIndex + 1] : '';

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

        // Return room data for playing (without createdBy for security)
        const playRoom = {
          roomId: room.roomId,
          iconLayout: room.iconLayout,
          questions: room.questions,
          createdAt: room.createdAt,
        };

        span.setAttributes({
          'room.id': room.id,
          'room.roomId': room.roomId,
          'play.access': true
        });

        return NextResponse.json(playRoom);
      } catch (error) {
        span.setStatus({ code: 2, message: 'Failed to fetch room for play' });
        console.error('Error fetching room for play:', error);
        return NextResponse.json(
          { error: 'Failed to fetch room' },
          { status: 500 }
        );
      } finally {
        span.end();
      }
    });
}
