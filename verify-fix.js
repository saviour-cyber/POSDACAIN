const { PrismaClient } = require('@prisma/client')
const { PrismaNeon } = require('@prisma/adapter-neon')
const { Pool, neonConfig } = require('@neondatabase/serverless')
const ws = require('ws')

neonConfig.webSocketConstructor = ws

const connectionString = 'postgresql://neondb_owner:npg_OS2R3DdpHLCV@ep-frosty-morning-a9b0xkre-pooler.gwc.azure.neon.tech/neondb?sslmode=require';

async function verify() {
  console.log('Verifying Prisma with Neon Adapter (WebSocket)...')
  
  // Explicitly set the environment variable just in case Prisma client looks for it
  process.env.DATABASE_URL = connectionString;

  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const tenantCount = await prisma.tenant.count()
    console.log('Success! Connection established via Prisma adapter.')
    console.log('Total tenants in DB:', tenantCount)
  } catch (err) {
    console.error('Prisma Adapter verification failed:', err.message)
    console.error('Stack trace:', err.stack)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

verify()
