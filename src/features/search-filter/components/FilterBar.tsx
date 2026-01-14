/**
 * Search & Filter Feature - Filter Bar Component
 * Complete filter controls including search, dropdown, and clear button
 */

import React from "react";
import { SearchBar } from "./SearchBar";
import { FilterDropdown } from "./FilterDropdown";
import { ClearFiltersButton } from "./ClearFiltersButton";
import type { FilterStatus } from "../types";

interface FilterBarProps {
  searchTerm: string;
  filterStatus: FilterStatus;
  onSearchChange: (term: string) => void;
  onFilterChange: (status: FilterStatus) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <SearchBar value={searchTerm} onChange={onSearchChange} />
      <FilterDropdown value={filterStatus} onChange={onFilterChange} />
      {hasActiveFilters && <ClearFiltersButton onClick={onClearFilters} />}
    </div>
  );
}
