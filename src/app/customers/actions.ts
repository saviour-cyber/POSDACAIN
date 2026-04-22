'use server';

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const company = formData.get("company") as string;
  const kraPin = formData.get("kraPin") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const creditLimit = parseFloat(formData.get("creditLimit") as string || "0");
  
  const metadata: any = {};
  
  if (session.user.businessType === 'Clinic') {
    if (formData.get("bloodType")) metadata.bloodType = formData.get("bloodType");
    if (formData.get("allergies")) metadata.allergies = formData.get("allergies");
    if (formData.get("medicalHistory")) metadata.medicalHistory = formData.get("medicalHistory");
  }

  if (session.user.businessType === 'School') {
    if (formData.get("admissionNo")) metadata.admissionNo = formData.get("admissionNo");
    if (formData.get("grade")) metadata.grade = formData.get("grade");
    if (formData.get("parentContact")) metadata.parentContact = formData.get("parentContact");
  }

  try {
    // 1. Generate System ID (Code)
    const customerCount = await prisma.customer.count({
      where: { tenantId: session.user.tenantId }
    });
    const systemCode = `CUST-${(1000 + customerCount + 1).toString()}`;

    // 2. Create customer
    await prisma.customer.create({
      data: {
        name,
        company,
        kraPin,
        phone,
        email,
        creditLimit,
        code: systemCode,
        tenantId: session.user.tenantId,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      }
    });

    revalidatePath("/customers");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create customer:", error);
    return { success: false, error: error?.message || "Failed to create customer profile" };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const company = formData.get("company") as string;
  const kraPin = formData.get("kraPin") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const creditLimit = parseFloat(formData.get("creditLimit") as string || "0");

  const metadata: any = {};
  if (session.user.businessType === 'Clinic') {
    if (formData.get("bloodType")) metadata.bloodType = formData.get("bloodType");
    if (formData.get("allergies")) metadata.allergies = formData.get("allergies");
    if (formData.get("medicalHistory")) metadata.medicalHistory = formData.get("medicalHistory");
  }

  try {
    await prisma.customer.update({
      where: { id, tenantId: session.user.tenantId },
      data: {
        name,
        company,
        kraPin,
        phone,
        email,
        creditLimit,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      }
    });

    revalidatePath("/customers");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update customer:", error);
    return { success: false, error: error?.message || "Failed to update customer profile" };
  }
}

export async function deleteCustomer(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.customer.delete({
      where: { id, tenantId: session.user.tenantId }
    });

    revalidatePath("/customers");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete customer:", error);
    return { success: false, error: "Failed to delete customer. Ensure they have no linked sales history." };
  }
}

export async function updateLoyaltyPoints(customerId: string, points: number) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        loyaltyPts: {
          increment: points
        }
      }
    });

    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to update loyalty points:", error);
    return { success: false, error: "System error updating loyalty" };
  }
}

export async function getCustomers(params: {
  page?: number,
  limit?: number,
  search?: string
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {
    tenantId: session.user.tenantId,
  };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { code: { contains: params.search, mode: 'insensitive' } },
      { company: { contains: params.search, mode: 'insensitive' } },
      { phone: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: {
        sales: {
          include: {
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.customer.count({ where })
  ]);

  // Aggregate stats per customer
  const enrichedCustomers = customers.map(c => {
    let totalSpent = 0;
    let creditBalance = 0;

    c.sales.forEach(sale => {
      totalSpent += sale.totalAmount;
      const paid = sale.payments.reduce((sum, p) => sum + p.amount, 0);
      creditBalance += (sale.totalAmount - paid);
    });

    return {
      ...c,
      totalSpent,
      creditBalance: Math.max(0, creditBalance)
    };
  });

  return {
    customers: enrichedCustomers,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getCustomerHistory(customerId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const sales = await prisma.sale.findMany({
    where: {
      customerId,
      tenantId: session.user.tenantId
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      payments: true,
      user: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return sales;
}
