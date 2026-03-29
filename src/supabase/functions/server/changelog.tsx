import * as kv from "./kv_store.tsx";

export interface ChangelogEntry {
  id: string;
  timestamp: string;
  action: "ITEM_ADDED" | "ITEM_UPDATED" | "ITEM_DELETED" | "STOCK_OUT";
  itemId: string;
  itemName: string;
  batchNumber?: string;
  fieldsChanged?: string[];
  snapshot?: Record<string, any>;
  performedBy: string;
}

/**
 * Create a changelog entry for tracking item changes
 */
export async function createChangelogEntry(
  action: ChangelogEntry["action"],
  itemId: string,
  itemName: string,
  performedBy: string,
  options?: {
    batchNumber?: string;
    fieldsChanged?: string[];
    snapshot?: Record<string, any>;
    authHeader?: string;
    tenantId?: string;
  }
): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const entryId = crypto.randomUUID();

    // Use timestamp in key for chronological ordering
    const key = `changelog:${timestamp}:${entryId}`;

    const entry: ChangelogEntry = {
      id: entryId,
      timestamp,
      action,
      itemId,
      itemName,
      batchNumber: options?.batchNumber,
      fieldsChanged: options?.fieldsChanged,
      snapshot: options?.snapshot,
      performedBy: performedBy || "System",
    };

    await kv.set(key, entry, options?.authHeader, options?.tenantId);
    console.log(`Created changelog entry: ${action} for item ${itemName} (${itemId})`);
  } catch (error) {
    console.error("Failed to create changelog entry:", error);
    // Don't throw - we don't want changelog failures to break main operations
  }
}

/**
 * Get all changelog entries (sorted by timestamp descending)
 */
export async function getAllChangelogEntries(authHeader?: string, tenantId?: string): Promise<ChangelogEntry[]> {
  try {
    const entries = await kv.getByPrefix("changelog:", authHeader, tenantId);
    // Sort by timestamp descending (newest first)
    return entries.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch changelog entries:", error);
    throw error;
  }
}

/**
 * Compare two objects and return list of changed fields
 */
export function getChangedFields(oldObj: any, newObj: any): string[] {
  const changed: string[] = [];
  const keysToCheck = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  // Ignore system fields
  const systemFields = ["id", "lastModifiedDate", "lastModifiedBy"];

  for (const key of keysToCheck) {
    if (systemFields.includes(key)) continue;

    // Handle different types of comparisons
    if (oldObj[key] !== newObj[key]) {
      // Special handling for objects/arrays
      if (typeof oldObj[key] === 'object' || typeof newObj[key] === 'object') {
        if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
          changed.push(key);
        }
      } else {
        changed.push(key);
      }
    }
  }

  return changed;
}

/**
 * Create a snapshot of relevant item fields
 */
export function createItemSnapshot(item: any): Record<string, any> {
  return {
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    expiry: item.expiry,
    status: item.status,
    batchNumber: item.batchNumber,
    donor: item.donor,
    expiringThreshold: item.expiringThreshold,
  };
}

/**
 * Clear all changelog entries
 */
export async function clearAllChangelogEntries(authHeader?: string, tenantId?: string): Promise<number> {
  try {
    const entries = await kv.getByPrefix("changelog:", authHeader, tenantId);
    const keys = entries.map(entry => {
      // SECURITY: Validate timestamp and ID format before reconstructing key
      // Timestamps should be ISO 8601 format, IDs should be UUIDs
      const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!timestampRegex.test(entry.timestamp)) {
        console.warn(`Invalid timestamp format in changelog entry: ${entry.timestamp}`);
        return null;
      }

      if (!uuidRegex.test(entry.id)) {
        console.warn(`Invalid UUID format in changelog entry: ${entry.id}`);
        return null;
      }

      // Reconstruct the key format: changelog:timestamp:id
      return `changelog:${entry.timestamp}:${entry.id}`;
    }).filter(key => key !== null) as string[];

    if (keys.length > 0) {
      await kv.mdel(keys, authHeader, tenantId);
      console.log(`Cleared ${keys.length} changelog entries`);
    }

    return keys.length;
  } catch (error) {
    console.error("Failed to clear changelog entries:", error);
    throw error;
  }
}