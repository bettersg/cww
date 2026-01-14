import { toast } from "sonner@2.0.3";
import { api } from "../../utils/api";
import { exportToCSV } from "../../utils/exportHelpers";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  expiry: string | null;
  status: "fresh" | "expiring" | "expired" | "depleted";
  batchNumber: string;
  receivedDate: string;
  donor?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  expiringThreshold: number;
}

/**
 * Hook for handling export and database actions
 */
export function useExportActions() {
  const handleExport = (items: InventoryItem[]) => {
    exportToCSV(items);
    toast.success(`Exported ${items.length} items to CSV`);
  };

  const handleInitializeDatabase = async (
    onSuccess: (items: InventoryItem[]) => void
  ) => {
    try {
      const result = await api.initializeDatabase();
      toast.success(result.message || "Database initialized successfully");
      
      // Reload items
      const fetchedItems = await api.getAllItems();
      onSuccess(fetchedItems);
    } catch (error) {
      console.error("Error initializing database:", error);
      toast.error("Failed to initialize database. Please try again.");
      throw error;
    }
  };

  return {
    handleExport,
    handleInitializeDatabase,
  };
}
