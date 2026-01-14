import { Edit, Copy, Trash2, MoreVertical, PackageX, Package } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { formatDate, getDaysUntilExpiry, getExpiryIcon, getExpiryTextColor } from "./helpers";
import { InventoryItem } from "./types";

interface InventoryCardsProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDuplicateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export function InventoryCards({ 
  items, 
  onEditItem, 
  onDuplicateItem, 
  onDeleteItem 
}: InventoryCardsProps) {
  return (
    <div className="md:hidden space-y-1.5 p-2">
      {items.map((item) => (
        <Card key={item.id} className={`p-2.5 ${
          item.status === "depleted" ? "opacity-60" : ""
        }`}>
          {/* Header: Name + Actions */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`text-base font-medium leading-tight normal-case ${
              item.status === "depleted" ? "line-through" : ""
            }`}>
              {item.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 shrink-0 -mr-1 -mt-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="text-base"
              >
                <DropdownMenuItem
                  onClick={() => onEditItem(item)}
                  className="py-3"
                >
                  <Edit className="w-5 h-5 mr-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDuplicateItem(item)}
                  className="py-3"
                >
                  <Copy className="w-5 h-5 mr-3" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 py-3"
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 className="w-5 h-5 mr-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description if exists */}
          {item.description && (
            <p className="text-xs text-gray-600 mb-1.5 leading-snug normal-case">
              {item.description}
            </p>
          )}

          {/* Compact info row: Expiry + Quantity */}
          <div className="flex items-center justify-between gap-2">
            {/* Expiry Date */}
            <div
              className={`flex items-center gap-1 ${getExpiryTextColor(item.status)}`}
            >
              {getExpiryIcon(item.status)}
              <div className="flex flex-col min-w-0">
                <span className="text-xs">
                  {item.expiry ? formatDate(item.expiry) : "No expiry"}
                </span>
                {item.expiry && item.status === "expiring" && (() => {
                  const days = getDaysUntilExpiry(item.expiry);
                  if (days !== null && days >= 0) {
                    return (
                      <span className="text-xs font-semibold text-orange-700">
                        {days === 0 ? "Today!" : `${days}d left`}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {/* Quantity display - compact */}
            {item.quantity === 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                <PackageX className="w-3 h-3" />
                Depleted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200">
                <Package className="w-3.5 h-3.5 text-[#F58220]" />
                <span className="text-sm font-semibold text-orange-900">
                  {item.quantity}
                </span>
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
