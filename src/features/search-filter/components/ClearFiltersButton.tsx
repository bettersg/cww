/**
 * Search & Filter Feature - Clear Filters Button Component
 */

import React from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface ClearFiltersButtonProps {
  onClick: () => void;
}

export function ClearFiltersButton({ onClick }: ClearFiltersButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-12 md:h-11 px-4 shrink-0"
    >
      <X className="w-4 h-4 mr-2" />
      Clear Filters
    </Button>
  );
}
