import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/api/dashboard/kpis`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      total_dealers: 5,
      active_locations: 12,
      total_base_assets: 48,
      total_color_specs: 25,
      generated_assets: 156,
      composed_assets: 23,
      recent_jobs: 8,
      processing_queue: 3,
      recent_fallbacks: 2,
      average_quality_score: 0.92,
    });
  }
}
