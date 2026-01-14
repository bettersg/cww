/**
 * Search & Filter Feature - Type Definitions
 * Handles filtering and search state management for inventory items
 */

export type FilterStatus = "all" | "fresh" | "expiring" | "expired" | "depleted";

export interface SearchFilterState {
  searchTerm: string;
  filterStatus: FilterStatus;
}

export interface SearchFilterActions {
  setSearchTerm: (term: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  clearFilters: () => void;
  toggleStatusFilter: (status: Exclude<FilterStatus, "all">) => void;
}

export interface UseSearchFilterResult extends SearchFilterState, SearchFilterActions {
  hasActiveFilters: boolean;
}
