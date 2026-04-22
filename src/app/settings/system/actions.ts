'use server';

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export type SystemConfig = {
  backup: {
    automatic: boolean;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    lastBackup?: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
  security: {
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    enableAuditLog: boolean;
  };
  passwordPolicy: {
    requireStrongPassword: boolean;
    passwordExpiryDays: number;
  };
  authentication: {
    enable2FA: boolean;
    enableSSO: boolean;
  };
};

const DEFAULT_CONFIG: SystemConfig = {
  backup: {
    automatic: true,
    frequency: 'Daily',
  },
  maintenance: {
    enabled: false,
    message: "System is currently undergoing maintenance. Please try again later.",
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableAuditLog: true,
  },
  passwordPolicy: {
    requireStrongPassword: true,
    passwordExpiryDays: 90,
  },
  authentication: {
    enable2FA: false,
    enableSSO: false,
  }
};

export async function getSystemConfig() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId }
  });

  if (!tenant) throw new Error("Tenant not found");

  const metadata = tenant.metadata as any;
  const storedConfig = metadata?.systemConfig || {};

  // Merge defaults with stored config to ensure all nested objects exist
  return {
    ...DEFAULT_CONFIG,
    ...storedConfig,
    backup: { ...DEFAULT_CONFIG.backup, ...(storedConfig.backup || {}) },
    maintenance: { ...DEFAULT_CONFIG.maintenance, ...(storedConfig.maintenance || {}) },
    security: { ...DEFAULT_CONFIG.security, ...(storedConfig.security || {}) },
    passwordPolicy: { ...DEFAULT_CONFIG.passwordPolicy, ...(storedConfig.passwordPolicy || {}) },
    authentication: { ...DEFAULT_CONFIG.authentication, ...(storedConfig.authentication || {}) },
  } as SystemConfig;
}

export async function updateSystemConfig(config: SystemConfig) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error("Unauthorized: Only admins can change system settings");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId }
  });

  if (!tenant) throw new Error("Tenant not found");

  const newMetadata = {
    ...(tenant.metadata as object || {}),
    systemConfig: config
  };

  await prisma.tenant.update({
    where: { id: session.user.tenantId },
    data: { metadata: newMetadata }
  });

  // Log the change
  if (config.security.enableAuditLog) {
    await logAuditEvent({
      type: 'Security',
      event: 'System settings updated',
      status: 'Success',
      level: 'WARNING',
      metadata: { updatedBy: session.user.email, config }
    });
  }

  revalidatePath('/settings/system');
  return { success: true };
}

export async function logAuditEvent(data: {
  type: string;
  event: string;
  status: string;
  level?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  metadata?: any;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return;

  try {
    // Check if audit logging is enabled for this tenant
    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      select: { metadata: true }
    });

    const config = (tenant?.metadata as any)?.systemConfig as SystemConfig;
    if (config?.security && !config.security.enableAuditLog) {
      return; // Logging is disabled
    }

    await prisma.systemLog.create({
      data: {
        tenantId: session.user.tenantId,
        type: data.type,
        event: data.event,
        status: data.status,
        level: data.level || 'INFO',
        terminalId: 'SYSTEM',
        metadata: data.metadata || {}
      }
    });
  } catch (err) {
    console.error("Failed to create audit log:", err);
  }
}
