import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Log the raw webhook for auditing
    await prisma.webhookLog.create({
      data: {
        source: 'MPESA',
        payload: body,
        status: 'PROCESSED'
      }
    });

    const callbackData = body.Body?.stkCallback;
    if (!callbackData) {
      return NextResponse.json({ message: "Invalid callback payload" }, { status: 400 });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callbackData;

    // Find the pending payment
    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
      include: { sale: true }
    });

    if (!payment) {
      console.error(`Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    if (ResultCode === 0) {
      // Success
      const metadataItems = CallbackMetadata?.Item || [];
      const receiptNo = metadataItems.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          transactionId: receiptNo,
          metadata: {
            ...((payment.metadata as object) || {}),
            resultDesc: ResultDesc,
            callbackRaw: callbackData
          }
        }
      });

      // Update the associated sale status to COMPLETED and mark as paid if not already
      // Note: Sale model currently defaults to COMPLETED, but we might want to ensure it's marked as paid in metadata
      await prisma.sale.update({
        where: { id: payment.saleId },
        data: {
          status: 'COMPLETED',
          metadata: {
            ...((payment.sale.metadata as object) || {}),
            paidAt: new Date(),
            paymentMethod: 'MPESA',
            receiptNo
          }
        }
      });

    } else {
      // Failed (ResultCode != 0)
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          metadata: {
            ...((payment.metadata as object) || {}),
            resultCode: ResultCode,
            resultDesc: ResultDesc
          }
        }
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error: any) {
    console.error("M-Pesa Webhook Error:", error);
    // Even if we fail processing, we return 200 to Safaricom to stop retries if appropriate,
    // but maybe 500 is safer depending on the error.
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
