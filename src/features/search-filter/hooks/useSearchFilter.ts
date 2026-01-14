/**
 * Search & Filter Feature - Main Hook
 * Manages search and filter state for inventory
 */

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner@2.0.3";
import type { FilterStatus, UseSearchFilterResult } from "../types";

export function useSearchFilter(): UseSearchFilterResult {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterStatus("all");
    toast.info("Filters cleared");
  }, []);

  const toggleStatusFilter = useCallback((status: Exclude<FilterStatus, "all">) => {
    setFilterStatus((prev) => (prev === status ? "all" : status));
  }, []);

  const hasActiveFilters = useMemo(
    () => searchTerm !== "" || filterStatus !== "all",
    [searchTerm, filterStatus]
  );

  return {
    searchTerm,
    filterStatus,
    setSearchTerm,
    setFilterStatus,
    clearFilters,
    toggleStatusFilter,
    hasActiveFilters,
  };
}
