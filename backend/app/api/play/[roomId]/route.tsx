import { prisma } from '@/lib/prisma';
import { trace } from '@opentelemetry/api';
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  return await trace
    .getTracer('custom-lms-backend')
    .startActiveSpan('play-room', async (span) => {
      try {
        const { roomId } = await params;

        const room = await prisma.room.findUnique({
          where: {
            roomId: roomId,
          },
          include: {
            user: true
          }
        });

        if (!room) {
          span.setStatus({ code: 2, message: 'Room not found' });
          return NextResponse.json(
            { error: 'Room not found' },
            { 
              status: 404,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              }
            }
          );
        }

        // Return room data for playing
        const playRoom = {
          roomId: room.roomId,
          iconLayout: room.iconLayout,
          questions: room.questions,
          createdAt: room.createdAt,
          createdBy: room.user?.name || 'Unknown'
        };

        span.setAttributes({
          'room.id': room.id,
          'room.roomId': room.roomId,
          'play.access': true
        });

        return NextResponse.json(playRoom, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      } catch (error) {
        span.setStatus({ code: 2, message: 'Failed to fetch room for play' });
        console.error('Error fetching room for play:', error);
        return NextResponse.json(
          { error: 'Failed to fetch room' },
          { 
            status: 500,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );
      } finally {
        span.end();
      }
    });
}