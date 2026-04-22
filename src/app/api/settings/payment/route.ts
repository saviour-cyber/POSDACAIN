import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { shortcode, passkey, consumerKey, consumerSecret, isActive } = body;

    const gateway = await prisma.paymentGateway.upsert({
      where: {
        tenantId_type: {
          tenantId: session.user.tenantId,
          type: 'mpesa'
        }
      },
      update: {
        shortcode,
        passkey,
        consumerKey,
        consumerSecret,
        isActive
      },
      create: {
        tenantId: session.user.tenantId,
        type: 'mpesa',
        shortcode,
        passkey,
        consumerKey,
        consumerSecret,
        isActive
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment Gateway Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
