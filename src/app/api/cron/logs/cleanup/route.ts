import { NextResponse } from "next/server";
import { pruneOldLogs } from "@/lib/logs/cleanup";

/**
 * REST Endpoint for automated log pruning.
 * Intended to be called by a cron scheduler (e.g., Vercel Cron, GitHub Actions).
 * 
 * Security: Authenticated via a Bearer token matching CRON_SECRET.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET || "internal_cron_secret_v1";

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[CRON] Starting automated log pruning...");
  const result = await pruneOldLogs();
  
  if (result.success) {
    return NextResponse.json({ 
      message: `Automated cleanup complete. ${result.count} logs removed.`,
      count: result.count 
    });
  }

  return NextResponse.json({ error: result.error }, { status: 500 });
}

// Support POST as well for flexibility
export async function POST(req: Request) {
  return GET(req);
}
