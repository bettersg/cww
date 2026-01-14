export interface InventoryItem {
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

export interface InventoryDisplayProps {
  items: InventoryItem[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onEditItem: (item: InventoryItem) => void;
  onDuplicateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}
