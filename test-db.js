const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected successfully!');
    const count = await prisma.tenant.count();
    console.log('Query successful, tenant count:', count);
  } catch (e) {
    console.error('Connection failed! Extracted message:');
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
