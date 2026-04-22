"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function saveSystemSettings(settings: any) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
    const tenant = await prisma.tenant.update({
      where: { id: session.user.tenantId },
      data: {
        metadata: settings,
      },
    });

    revalidatePath("/settings");
    return { success: true, tenant };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}
