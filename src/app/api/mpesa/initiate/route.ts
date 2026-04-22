import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MpesaService } from "@/services/mpesaService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phoneNumber, amount, saleId } = await req.json();

    if (!phoneNumber || !amount || !saleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Determine callback URL based on environment
    // In production, this should be the public URL
    const callbackBase = process.env.NEXTAUTH_URL || "https://" + req.headers.get("host");
    const callbackUrl = `${callbackBase}/api/mpesa/callback`;

    const result = await MpesaService.initiateSTKPush({
      tenantId: session.user.tenantId,
      saleId,
      phoneNumber,
      amount,
      callbackUrl
    });

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error("M-Pesa Initiation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
