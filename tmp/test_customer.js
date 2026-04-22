const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.log("No tenant found to test with.");
      return;
    }

    const name = "Test Customer " + Date.now();
    const customerCount = await prisma.customer.count({
      where: { tenantId: tenant.id }
    });
    const systemCode = `CUST-${(1000 + customerCount + 1).toString()}`;

    const customer = await prisma.customer.create({
      data: {
        name,
        code: systemCode,
        tenantId: tenant.id,
        phone: "+254700000000",
        creditLimit: 5000,
      }
    });

    console.log("SUCCESS: Created customer:", customer);
    
    // Cleanup
    await prisma.customer.delete({ where: { id: customer.id } });
    console.log("SUCCESS: Cleaned up test customer.");
  } catch (err) {
    console.error("FAILURE: Test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
