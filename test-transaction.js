const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const url = 'postgresql://neondb_owner:npg_OS2R3DdpHLCV@ep-frosty-morning-a9b0xkre-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require'.replace(/^\"+|\"+$/g, '');

async function test() {
  console.log('--- Testing Transaction via WebSocket Adapter ---');
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Step 1: Simple Query...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Simple Query OK');

    console.log('Step 2: Starting Transaction...');
    await prisma.$transaction(async (tx) => {
      console.log('Inside Transaction');
      await tx.$queryRaw`SELECT 1`;
    });
    console.log('✅ Transaction OK');

  } catch (e) {
    console.error('❌ FAILED:', e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
