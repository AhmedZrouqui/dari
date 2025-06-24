import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { token, refreshToken } = await request.json();

    const cookieStore = await cookies();

    // Set HTTP-only cookies
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    cookieStore.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to set cookies:', error);
    return NextResponse.json(
      { error: 'Failed to set cookies' },
      { status: 500 }
    );
  }
}
