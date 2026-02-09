/**
 * Search & Filter Feature - Filtering Logic Hook
 * Applies search and filter criteria to inventory items
 */

import { useMemo } from "react";
import type { FilterStatus } from "../types";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  expiry: string | null;
  status: "fresh" | "expiring" | "expired" | "depleted";
  batchNumber: string;
  donor?: string;
}

interface UseFilteredItemsParams {
  items: InventoryItem[];
  searchTerm: string;
  filterStatus: FilterStatus;
}

export function useFilteredItems({
  items,
  searchTerm,
  filterStatus,
}: UseFilteredItemsParams): InventoryItem[] {
  return useMemo(() => {
    return items.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.batchNumber.toLowerCase().includes(searchLower) ||
        (item.donor && item.donor.toLowerCase().includes(searchLower));
      const matchesFilter =
        filterStatus === "all"
          ? item.status !== "depleted"
          : item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [items, searchTerm, filterStatus]);
}
