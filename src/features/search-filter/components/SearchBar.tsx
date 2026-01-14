/**
 * Search & Filter Feature - Search Bar Component
 */

import React from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search for items..." }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F58220] w-5 h-5 md:w-4 md:h-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 md:pl-10 h-12 md:h-10 text-base bg-white border-gray-300"
      />
    </div>
  );
}
