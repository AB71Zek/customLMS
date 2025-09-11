import { NextResponse } from 'next/server';

type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
};

// Temporary in-memory store (replace with Prisma soon)
const users: User[] = [
  {
    id: 'u_1',
    email: 'student@example.com',
    name: 'Student One',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name } = body ?? {};

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: 'email already exists' }, { status: 409 });
    }

    const newUser: User = {
      id: `u_${users.length + 1}`,
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'failed to create user' }, { status: 500 });
  }
}


