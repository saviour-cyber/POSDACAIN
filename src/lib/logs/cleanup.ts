import prisma from "@/lib/prisma";

/**
 * Prunes old logs based on tiered retention strategy:
 * - Technical Logs (System, Security, Sync): 30 Days
 * - SMS/Reminder Logs: 90 Days
 * - Transaction Logs: Retained (Archived/Indefinite)
 */
export async function pruneOldLogs() {
  const now = new Date();
  
  // 30 Days Ago (for Technical Logs)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // 90 Days Ago (for SMS/Reminders)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  try {
     const results = await Promise.all([
        // 1. Prune Technical Logs
        prisma.systemLog.deleteMany({
          where: {
            createdAt: { lt: thirtyDaysAgo },
            type: { in: ["System", "Security", "Sync", "Diagnostic"] }
          }
        }),

        // 2. Prune SMS/Reminder Logs
        prisma.systemLog.deleteMany({
          where: {
            createdAt: { lt: ninetyDaysAgo },
            type: { in: ["SMS", "Reminder"] }
          }
        })
     ]);

     const totalPruned = results.reduce((acc, r) => acc + r.count, 0);

     // Record the cleanup event in the logs
     const firstTenant = await prisma.tenant.findFirst({ select: { id: true } });
     
     if (firstTenant) {
       await prisma.systemLog.create({
          data: {
             tenantId: firstTenant.id,
             type: "System",
             level: "INFO",
             event: "Automated Log Pruning",
             status: "Success",
             terminalId: "SERVER",
             metadata: {
                prunedCount: totalPruned,
                thirtyDayThreshold: thirtyDaysAgo.toISOString(),
                ninetyDayThreshold: ninetyDaysAgo.toISOString()
             }
          }
       });
     }

     return { success: true, count: totalPruned };
  } catch (error: any) {
    console.error("Failed to prune logs:", error);
    return { success: false, error: error.message };
  }
}
