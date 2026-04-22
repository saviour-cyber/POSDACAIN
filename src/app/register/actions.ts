'use server';

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function registerTenant(formData: FormData) {
  console.log('--- Registration Attempt (HTTP Fallback) ---');
  const url = (process.env.DATABASE_URL || '').trim().replace(/^"+|"+$/g, '');
  
  if (!url) {
    return { error: 'Database configuration missing.' };
  }

  const sql = neon(url);

  try {
    const adminName = formData.get('adminName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const storeName = formData.get('storeName') as string;
    const businessType = formData.get('businessType') as string;

    if (!adminName || !email || !password || !storeName || !businessType) {
      return { error: 'All fields are required.' };
    }

    // Check if email already exists
    const existing = await sql`SELECT id FROM "User" WHERE email = ${email} LIMIT 1`;

    if (existing.length > 0) {
      return { error: 'An account with this email already exists.' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Manual Transaction (Native SQL)
    // Note: We use UUID generator in SQL to match Prisma defaults
    await sql.transaction([
      sql`INSERT INTO "Tenant" (id, name, "businessType", "updatedAt") 
          VALUES (gen_random_uuid(), ${storeName}, ${businessType}, now()) 
          RETURNING id`,
      sql`INSERT INTO "User" (id, "tenantId", name, email, password, role, "updatedAt")
          SELECT gen_random_uuid(), id, ${adminName}, ${email}, ${hashedPassword}, 'ADMIN', now()
          FROM "Tenant" WHERE name = ${storeName} ORDER BY "createdAt" DESC LIMIT 1`
    ]);

    console.log('✅ Registration Successful via HTTP Fallback');
    return { success: true };
  } catch (error: any) {
    console.error('Registration Error (HTTP):', error.message);
    return { error: `Registration failed: ${error.message}` };
  }
}
