import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

const prismaClientSingleton = () => {
  const url = (process.env.DATABASE_URL || '').trim().replace(/^"+|"+$/g, '') 
  
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
       throw new Error('DATABASE_URL is missing from environment');
    }
    return new PrismaClient(); // Fallback for local non-DB tasks
  }

  try {
    // 1. Create a Neon HTTP client (Bypasses Port 5432 and WebSocket hurdles)
    const sql = neon(url)
    
    // 2. Wrap it with the Prisma adapter for type-safe queries
    const adapter = new PrismaNeon(sql)
    
    // 3. Create optimized Prisma Client
    return new PrismaClient({ 
      adapter,
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn']
    })
  } catch (err) {
    console.error('❌ Prisma Initialization Error:', err);
    throw err;
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
