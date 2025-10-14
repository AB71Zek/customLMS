import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId;

    const room = await prisma.room.findUnique({
      where: {
        roomId: roomId,
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Return room data for playing (without createdBy for security)
    const playRoom = {
      roomId: room.roomId,
      iconLayout: JSON.parse(room.iconLayout),
      questions: JSON.parse(room.questions),
      createdAt: room.createdAt,
    };

    return NextResponse.json(playRoom);
  } catch (error) {
    console.error('Error fetching room for play:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}
