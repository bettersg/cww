import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasActiveFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-sm mx-auto">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1738618141234-1ee52c6475a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGFudHJ5JTIwc2hlbHZlc3xlbnwxfHx8fDE3NjU5NzY2MTB8MA&ixlib=rb-4.1.0&q=80&w=400"
          alt="Empty pantry"
          className="w-48 h-48 mx-auto mb-6 rounded-lg object-cover opacity-60"
        />
        <p className="text-xl font-semibold text-gray-700 mb-2">
          No items found
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {hasActiveFilters 
            ? "Try adjusting your search or filter criteria" 
            : "Get started by adding your first inventory item"}
        </p>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="mx-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
