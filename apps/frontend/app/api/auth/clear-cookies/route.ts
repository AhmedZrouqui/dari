import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete('auth-token');
    cookieStore.delete('refresh-token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to clear cookies:', error);
    return NextResponse.json(
      { error: 'Failed to clear cookies' },
      { status: 500 }
    );
  }
}
