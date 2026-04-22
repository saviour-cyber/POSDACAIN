'use server';

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getSystemConfig } from "../system/actions";

function isStrongPassword(password: string) {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password.length >= minLength && hasUpper && hasLower && hasNumber;
}

export async function createUser(tenantId: string, data: any) {
  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { error: 'A user with this email already exists.' };
    }

    // Check Password Policy
    const config = await getSystemConfig();
    if (config.passwordPolicy.requireStrongPassword && !isStrongPassword(data.password)) {
       return { error: 'Password does not meet complexity requirements (min 8 chars, uppercase, lowercase, numbers).' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        tenantId,
        metadata: {
          passwordUpdatedAt: new Date().toISOString()
        }
      }
    });

    revalidatePath('/settings/users');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { error: 'Failed to create user.' };
  }
}

export async function deleteUser(userId: string, tenantId: string) {
  try {
    await prisma.user.deleteMany({
      where: { 
        id: userId,
        tenantId // Ensure they only delete within their tenant
      }
    });
    
    revalidatePath('/settings/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { error: 'Failed to delete user.' };
  }
}
