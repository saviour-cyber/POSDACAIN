import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Only allow Admins to download full system backups
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    // Fetch all business records for this tenant in parallel
    const [tenant, users, products, customers, sales] = await Promise.all([
      prisma.tenant.findUnique({ where: { id: tenantId } }),
      prisma.user.findMany({ 
        where: { tenantId },
        select: { id: true, name: true, email: true, role: true, createdAt: true } // Don't export hashed passwords
      }),
      prisma.product.findMany({ where: { tenantId } }),
      prisma.customer.findMany({ where: { tenantId } }),
      prisma.sale.findMany({ 
        where: { tenantId },
        include: { items: true } 
      })
    ]);

    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tenant,
      data: {
        users,
        products,
        customers,
        sales
      }
    };

    // Return as a downloadable JSON file
    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="dacainsystems_backup_${new Date().toISOString().split('T')[0]}.json"`,
      },
    });

  } catch (error) {
    console.error('Backup Error:', error);
    return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 });
  }
}
