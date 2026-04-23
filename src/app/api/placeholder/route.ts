import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'car';
  const width = parseInt(searchParams.get('w') || '400');
  const height = parseInt(searchParams.get('h') || '300');

  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e2e8f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="none" stroke="#94a3b8" stroke-width="2" rx="8"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="system-ui, sans-serif" font-size="16" fill="#64748b">
        ${type === 'car' ? '🚗 Vehicle' : type === 'location' ? '🏢 Location' : '🖼️ Image'}
      </text>
      <text x="50%" y="65%" text-anchor="middle" dy=".3em" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">
        ${width} × ${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}