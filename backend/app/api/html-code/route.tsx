import { NextResponse } from 'next/server';

type HtmlCode = {
  id: string;
  userId: string;
  title: string;
  htmlContent: string;
  createdAt: string;
};

// Temporary in-memory store (replace with Prisma soon)
const htmlCodes: HtmlCode[] = [];

export async function GET() {
  return NextResponse.json({ htmlCodes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, title, htmlContent } = body ?? {};

    if (!userId || !htmlContent) {
      return NextResponse.json({ 
        error: 'userId and htmlContent are required' 
      }, { status: 400 });
    }

    const newHtmlCode: HtmlCode = {
      id: `html_${Date.now()}`,
      userId,
      title: title || 'Untitled HTML Code',
      htmlContent,
      createdAt: new Date().toISOString(),
    };

    htmlCodes.push(newHtmlCode);
    return NextResponse.json(newHtmlCode, { status: 201 });
  } catch (err) {
    return NextResponse.json({ 
      error: 'Failed to save HTML code' 
    }, { status: 500 });
  }
}
