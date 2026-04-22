import prisma from "@/lib/prisma";

export interface MpesaCredentials {
  shortcode: string;
  passkey: string;
  consumerKey: string;
  consumerSecret: string;
}

export class MpesaService {
  private static ENV = process.env.NODE_ENV === 'production' ? 'api' : 'sandbox';
  private static BASE_URL = `https://${this.ENV}.safaricom.co.ke`;

  /**
   * Get M-Pesa credentials for a specific tenant
   */
  private static async getCredentials(tenantId: string): Promise<MpesaCredentials> {
    const gateway = await prisma.paymentGateway.findUnique({
      where: {
        tenantId_type: {
          tenantId,
          type: 'mpesa'
        }
      }
    });

    if (!gateway || !gateway.shortcode || !gateway.passkey || !gateway.consumerKey || !gateway.consumerSecret) {
      throw new Error('M-Pesa credentials not configured for this tenant');
    }

    return {
      shortcode: gateway.shortcode,
      passkey: gateway.passkey,
      consumerKey: gateway.consumerKey,
      consumerSecret: gateway.consumerSecret
    };
  }

  /**
   * Generate Access Token from Safaricom Daraja
   */
  private static async getAccessToken(credentials: MpesaCredentials): Promise<string> {
    const auth = Buffer.from(`${credentials.consumerKey}:${credentials.consumerSecret}`).toString('base64');
    
    const response = await fetch(`${this.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get M-Pesa access token: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Initiate STK Push (Lipa Na M-Pesa Online)
   */
  public static async initiateSTKPush(params: {
    tenantId: string;
    saleId: string;
    phoneNumber: string;
    amount: number;
    callbackUrl: string;
  }) {
    const credentials = await this.getCredentials(params.tenantId);
    const accessToken = await this.getAccessToken(credentials);

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const password = Buffer.from(`${credentials.shortcode}${credentials.passkey}${timestamp}`).toString('base64');

    // Ensure phone number starts with 254
    let phone = params.phoneNumber.replace(/\+/g, '');
    if (phone.startsWith('0')) {
      phone = '254' + phone.substring(1);
    } else if (phone.startsWith('7') || phone.startsWith('1')) {
      phone = '254' + phone;
    }

    const body = {
      BusinessShortCode: credentials.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline", // or CustomerBuyGoodsOnline
      Amount: Math.round(params.amount),
      PartyA: phone,
      PartyB: credentials.shortcode,
      PhoneNumber: phone,
      CallBackURL: params.callbackUrl,
      AccountReference: `SALE-${params.saleId.substring(0, 8)}`,
      TransactionDesc: "POS Payment"
    };

    const response = await fetch(`${this.BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.ResponseCode === "0") {
      // Success: Create or update payment record
      await prisma.payment.create({
        data: {
          saleId: params.saleId,
          method: 'MPESA',
          amount: params.amount,
          status: 'PENDING',
          checkoutRequestId: data.CheckoutRequestId,
          metadata: {
            merchantRequestId: data.MerchantRequestId,
            phone: phone
          }
        }
      });

      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestId,
        message: data.CustomerMessage || data.ResponseDescription
      };
    } else {
      return {
        success: false,
        error: data.errorMessage || data.ResponseDescription
      };
    }
  }
}
