import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const checkoutRequestId = searchParams.get("checkoutRequestId");

    if (!checkoutRequestId) {
      return NextResponse.json({ error: "Missing checkoutRequestId" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId },
      select: {
        status: true,
        transactionId: true,
        metadata: true,
        updatedAt: true
      }
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: payment.status,
      receiptNo: payment.transactionId,
      message: (payment.metadata as any)?.resultDesc || (payment.status === 'PENDING' ? "Waiting for customer..." : "")
    });
  } catch (error: any) {
    console.error("M-Pesa Status Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
