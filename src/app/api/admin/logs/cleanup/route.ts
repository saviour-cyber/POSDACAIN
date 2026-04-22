import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pruneOldLogs } from "@/lib/logs/cleanup";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Security: Only Super Admins can manually trigger pruning
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pruneOldLogs();
  
  if (result.success) {
    return NextResponse.json({ 
      message: `Log pruning complete. ${result.count} logs removed.`,
      count: result.count 
    });
  }

  return NextResponse.json({ error: result.error }, { status: 500 });
}
