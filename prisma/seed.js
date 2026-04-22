const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a default tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Default Store',
      businessType: 'General Merchandise',
      domain: 'default-store',
    }
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create an admin user
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@canonpos.co.ke',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: tenant.id
    }
  });

  console.log('Seed successful!');
  console.log('Login with: admin@canonpos.co.ke / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
