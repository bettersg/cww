import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { EmptyState } from "./EmptyState";
import { InventoryTable } from "./InventoryTable";
import { InventoryCards } from "./InventoryCards";
import { InventoryDisplayProps } from "./types";

export function InventoryDisplay({
  items,
  hasActiveFilters,
  onClearFilters,
  onEditItem,
  onDuplicateItem,
  onDeleteItem,
}: InventoryDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Current Inventory
          <span className="text-sm font-normal text-gray-500">
            ({items.length} items)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <EmptyState 
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
          />
        ) : (
          <>
            <InventoryTable
              items={items}
              onEditItem={onEditItem}
              onDuplicateItem={onDuplicateItem}
              onDeleteItem={onDeleteItem}
            />
            <InventoryCards
              items={items}
              onEditItem={onEditItem}
              onDuplicateItem={onDuplicateItem}
              onDeleteItem={onDeleteItem}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
