import { Edit, Copy, Trash2, MoreVertical, PackageX } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { formatDate, getDaysUntilExpiry, getExpiryIcon, getExpiryTextColor } from "./helpers";
import { InventoryItem } from "./types";

interface InventoryTableProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDuplicateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export function InventoryTable({ 
  items, 
  onEditItem, 
  onDuplicateItem, 
  onDeleteItem 
}: InventoryTableProps) {
  return (
    <div className="hidden md:block">
      <div className="border-b bg-gray-50">
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-600">
          <div className="col-span-6">
            Item Name
          </div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-3">
            Expiry Date
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className={`border-b last:border-b-0 ${
            item.status === "depleted" ? "opacity-60" : ""
          }`}
        >
          <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
            <div className="col-span-6">
              <div className={`font-medium normal-case ${
                item.status === "depleted" ? "line-through" : ""
              }`}>
                {item.name}
              </div>
              {item.description && (
                <div className="text-sm text-gray-600 mt-1 normal-case">
                  {item.description}
                </div>
              )}
            </div>
            <div className="col-span-2">
              {item.quantity === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 text-gray-600 text-sm">
                  <PackageX className="w-3.5 h-3.5" />
                  Depleted
                </span>
              ) : (
                <span className="font-medium">
                  {item.quantity}
                </span>
              )}
            </div>
            <div
              className={`col-span-2 flex items-center gap-2 ${getExpiryTextColor(item.status)}`}
            >
              {getExpiryIcon(item.status)}
              <div className="flex flex-col">
                <span>
                  {item.expiry ? formatDate(item.expiry) : "No expiry"}
                </span>
                {item.expiry && item.status === "expiring" && (() => {
                  const days = getDaysUntilExpiry(item.expiry);
                  if (days !== null && days >= 0) {
                    return (
                      <span className="text-xs font-semibold text-orange-700 mt-0.5">
                        {days === 0 ? "Expires today!" : `${days} day${days !== 1 ? 's' : ''} left`}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
            <div className="col-span-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-11 h-11 p-0"
                  >
                    <MoreVertical className="w-5 h-5 md:w-4 md:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onEditItem(item)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDuplicateItem(item)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => onDeleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
