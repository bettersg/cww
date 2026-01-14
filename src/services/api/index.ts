/**
 * API Services Index
 * Central export point for all API services
 * 
 * This maintains backward compatibility with the old api.ts structure
 * while providing the new modular service architecture
 */

import { inventoryService } from './inventoryService';
import { stockingService } from './stockingService';
import { auditLogService } from './auditLogService';

// Export all services
export { inventoryService, stockingService, auditLogService };

// Export backward-compatible unified API object
export const api = {
  // Inventory operations
  getAllItems: inventoryService.getAllItems,
  getItem: inventoryService.getItem,
  createItem: inventoryService.createItem,
  updateItem: inventoryService.updateItem,
  deleteItem: inventoryService.deleteItem,
  initializeDatabase: inventoryService.initializeDatabase,

  // Stocking operations
  stockOutItems: stockingService.stockOutItems,
  distributeItems: stockingService.distributeItems,

  // Audit log operations
  getChangelog: auditLogService.getChangelog,
  getChangelogExportUrl: auditLogService.getChangelogExportUrl,
  clearChangelog: auditLogService.clearChangelog,
};
