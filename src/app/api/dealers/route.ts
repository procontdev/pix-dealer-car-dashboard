// app/api/dealers/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/dealers`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dealers API error:', error);
    // Mock data
    return NextResponse.json([
      {
        id: '1',
        name: 'Premium Auto Dealers',
        location_count: 8,
        status: 'active',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
      },
    ]);
  }
}