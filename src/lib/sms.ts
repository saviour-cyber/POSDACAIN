import prisma from "./prisma";

interface SMSPayload {
  to: string;
  message: string;
  tenantId: string;
}

export async function sendSMS({ to, message, tenantId }: SMSPayload) {
  // 1. Fetch Tenant SMS Configuration
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { metadata: true }
  });

  const metadata = tenant?.metadata as any;
  const smsConfig = metadata?.sms;

  if (!smsConfig || !smsConfig.enabled) {
    console.log(`SMS skipped for tenant ${tenantId}: SMS not enabled in settings.`);
    return { success: false, error: 'SMS_DISABLED' };
  }

  const { provider, apiKey, username, senderId } = smsConfig;

  // 2. Format phone number (ensure +254 for Kenya if not present)
  let cleanPhone = to.replace(/\s+/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '+254' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+' + cleanPhone;
  }

  try {
    if (provider === 'AFRICAS_TALKING') {
      const response = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'apiKey': apiKey
        },
        body: new URLSearchParams({
          username: username,
          to: cleanPhone,
          message: message,
          from: senderId || ''
        })
      });

      const result = await response.json();
      console.log('Africa\'s Talking Response:', result);
      
      return { 
        success: true, 
        data: result 
      };
    }

    // Add other providers here (Advanta, MoveSMS etc.)
    
    return { success: false, error: 'INVALID_PROVIDER' };
  } catch (error) {
    console.error('SMS Send Error:', error);
    return { success: false, error: 'FETCH_FAILED' };
  }
}

/**
 * Helper to generate message templates
 */
export const SMSTemplates = {
  PARTIAL_PAYMENT_CONFIRMATION: (name: string, paid: number, balance: number, dueDate?: Date) => {
    let msg = `Hello ${name}, we have received KES ${paid.toLocaleString()}. Your remaining balance is KES ${balance.toLocaleString()}.`;
    if (dueDate) {
      msg += ` Please clear by ${new Date(dueDate).toLocaleDateString()}.`;
    }
    msg += ` Thank you for shopping with us!`;
    return msg;
  },
  
  DEBT_REMINDER: (name: string, balance: number, dueDate?: Date) => {
    let msg = `Hi ${name}, this is a friendly reminder of your outstanding balance of KES ${balance.toLocaleString()}.`;
    if (dueDate) {
      msg += ` Due date: ${new Date(dueDate).toLocaleDateString()}.`;
    }
    msg += ` Please visit us to settle. Thank you!`;
    return msg;
  }
};
