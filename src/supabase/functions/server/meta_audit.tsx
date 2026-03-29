import * as kv from "./kv_store.tsx";

/**
 * Meta-Audit Log
 * 
 * This is a permanent audit trail that tracks access to the main audit log.
 * Unlike the main changelog, entries in the meta-audit log CANNOT be cleared via API.
 * 
 * This ensures accountability even if someone clears the main audit log.
 */

export interface MetaAuditEntry {
  id: string;
  timestamp: string;
  action: "AUDIT_VIEWED" | "AUDIT_EXPORTED" | "AUDIT_CLEARED" | "AUDIT_CLEARED_ATTEMPT_BLOCKED";
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  details?: Record<string, any>;
}

/**
 * Create a meta-audit entry
 * These entries track access to the audit log itself
 */
export async function createMetaAuditEntry(
  action: MetaAuditEntry["action"],
  options?: {
    userId?: string;
    userEmail?: string;
    ipAddress?: string;
    details?: Record<string, any>;
    authHeader?: string;
    tenantId?: string;
  }
): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const entryId = crypto.randomUUID();

    // Use a different prefix to distinguish from regular changelog
    const key = `meta-audit:${timestamp}:${entryId}`;

    const entry: MetaAuditEntry = {
      id: entryId,
      timestamp,
      action,
      userId: options?.userId,
      userEmail: options?.userEmail,
      ipAddress: options?.ipAddress,
      details: options?.details,
    };

    await kv.set(key, entry, options?.authHeader, options?.tenantId);
    console.log(`[META-AUDIT] ${action} at ${timestamp} by ${options?.userEmail || options?.userId || 'unknown'}`);
  } catch (error) {
    console.error("Failed to create meta-audit entry:", error);
    // Don't throw - meta-audit failures shouldn't break operations
  }
}

/**
 * Get all meta-audit entries (admin only)
 * Note: This function should only be called by superadmin endpoints
 */
export async function getAllMetaAuditEntries(authHeader?: string, tenantId?: string): Promise<MetaAuditEntry[]> {
  try {
    const entries = await kv.getByPrefix("meta-audit:", authHeader, tenantId);
    // Sort by timestamp descending (newest first)
    return entries.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch meta-audit entries:", error);
    throw error;
  }
}

/**
 * Get meta-audit entries within a date range
 */
export async function getMetaAuditEntriesByDateRange(
  startDate: string,
  endDate: string,
  authHeader?: string,
  tenantId?: string
): Promise<MetaAuditEntry[]> {
  const allEntries = await getAllMetaAuditEntries(authHeader, tenantId);
  return allEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
  });
}
