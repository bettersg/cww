/**
 * Search & Filter Feature - Filter Dropdown Component
 */

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { FilterStatus } from "../types";

interface FilterDropdownProps {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

export function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-48 h-12 md:h-10 text-base bg-white border-[#F58220] text-[#F58220]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Items</SelectItem>
        <SelectItem value="fresh">Fresh Only</SelectItem>
        <SelectItem value="expiring">Expiring Soon</SelectItem>
        <SelectItem value="expired">Expired Only</SelectItem>
        <SelectItem value="depleted">Depleted Only</SelectItem>
      </SelectContent>
    </Select>
  );
}
