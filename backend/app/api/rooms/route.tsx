import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { iconLayout, questions, createdBy } = body;

    if (!iconLayout || !questions || !createdBy) {
      return NextResponse.json(
        { error: 'iconLayout, questions, and createdBy are required' },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        iconLayout: JSON.stringify(iconLayout),
        questions: JSON.stringify(questions),
        createdBy,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
