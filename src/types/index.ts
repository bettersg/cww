/**
 * Global TypeScript Type Definitions
 * Single source of truth for all shared types across the application
 */

// Core inventory item interface
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  expiry: string | null; // Allow null for items without expiry
  status: "fresh" | "expiring" | "expired" | "depleted";
  batchNumber: string;
  receivedDate: string;
  donor?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  expiringThreshold: number;
}

// Inventory statistics
export interface InventoryStats {
  fresh: number;
  expiring: number;
  expired: number;
  depleted: number;
}

// Filter types
export type StatusFilter = "all" | "fresh" | "expiring" | "expired" | "depleted";

// Changelog/Audit log entry
export interface ChangelogEntry {
  id: string;
  timestamp: string;
  action: "create" | "update" | "delete" | "stock_out";
  itemId: string;
  itemName: string;
  batchNumber: string;
  userId: string;
  changes?: ChangelogFieldChange[];
}

export interface ChangelogFieldChange {
  field: string;
  oldValue: any;
  newValue: any;
}

// Export item for CSV exports
export interface ExportItem {
  name: string;
  description: string;
  quantity: number;
  expiry: string | null;
  status: string;
  batchNumber: string;
  receivedDate: string;
  donor?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

// Stock out operation
export interface StockOutItem {
  id: string;
  quantity: number;
}

export interface StockOutRequest {
  items: StockOutItem[];
  stockedOutBy: string;
}
