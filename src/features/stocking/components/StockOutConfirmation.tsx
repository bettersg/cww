import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../../utils/formatters/dateFormatter';
import type { InventoryItem } from '../../../types';
import type { UseStockOutReturn } from '../hooks/useStockOut';
import { useAuth } from '../../../contexts/AuthContext';

interface StockOutConfirmationProps {
  hook: UseStockOutReturn;
  items: InventoryItem[];
  onConfirm: () => Promise<void>;
}

const getExpiryTextColor = (status: string) => {
  switch (status) {
    case "expired":
      return "text-red-600";
    case "expiring":
      return "text-orange-600";
    case "fresh":
      return "text-gray-600";
    case "depleted":
      return "text-gray-400";
    default:
      return "text-gray-600";
  }
};

export function StockOutConfirmation({ hook, items, onConfirm }: StockOutConfirmationProps) {
  const { user } = useAuth();
  return (
    <Dialog open={hook.isConfirmationOpen} onOpenChange={hook.closeConfirmation}>
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm Stock Out</DialogTitle>
          <DialogDescription className="text-base">
            Review the items you're about to stock out
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-auto flex-1 min-h-0">
          {/* Stock Out By */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Stocked out by:</p>
            <p className="font-medium break-words">{user?.name || "System"}</p>
          </div>

          {/* Items Summary */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b">
              <h4 className="font-medium">Items to Stock Out ({hook.selectedCount})</h4>
            </div>
            <div className="max-h-[300px] overflow-auto custom-scrollbar">
              <div className="divide-y">
                {Object.entries(hook.selectedItems).map(([itemId, qty]) => {
                  const item = items.find(i => i.id === itemId);
                  if (!item) return null;
                  
                  return (
                    <div key={itemId} className="p-3 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{item.name}</h5>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
                          <span className="font-mono">{item.batchNumber}</span>
                          <span>•</span>
                          <span className={getExpiryTextColor(item.status)}>
                            {item.expiry ? formatDate(item.expiry) : "No expiry"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-[#F58220]">{qty}</div>
                        <div className="text-xs text-gray-500">of {item.quantity}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Items:</span>
              <span className="font-semibold text-lg">
                {hook.totalUnits} units
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 border-t pt-4 flex-row">
          <Button
            variant="outline"
            onClick={hook.closeConfirmation}
            className="h-12 flex-1 text-base"
            disabled={hook.isStockingOut}
          >
            Go Back
          </Button>
          <Button
            onClick={async () => {
              await onConfirm();
              hook.closeConfirmation();
            }}
            disabled={hook.isStockingOut}
            className="h-12 flex-1 text-base"
          >
            {hook.isStockingOut ? "Processing..." : "Stock Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
