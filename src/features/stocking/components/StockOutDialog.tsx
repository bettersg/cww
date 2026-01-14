import React from 'react';
import { Search, Minus, Plus, CheckCircle, AlertCircle, PackageX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { formatDate } from '../../../utils/formatters/dateFormatter';
import type { InventoryItem } from '../../../types';
import type { UseStockOutReturn } from '../hooks/useStockOut';

interface StockOutDialogProps {
  hook: UseStockOutReturn;
  items: InventoryItem[];
}

const getExpiryIcon = (status: string) => {
  switch (status) {
    case "expired":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    case "expiring":
      return <AlertCircle className="w-4 h-4 text-orange-600" />;
    case "fresh":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "depleted":
      return <PackageX className="w-4 h-4 text-gray-400" />;
    default:
      return null;
  }
};

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

export function StockOutDialog({ hook, items }: StockOutDialogProps) {
  const filteredItems = hook.getFilteredItems(items);
  const availableCount = items.filter(item => item.quantity > 0).length;

  return (
    <Dialog
      open={hook.isDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          hook.closeDialog();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl w-[calc(100%-2rem)] max-h-[90vh] flex flex-col p-0" aria-describedby={undefined}>
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">Stock Out Items</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-3 px-6">
          <div className="space-y-2">
            <Label htmlFor="stocked-out-by" className="text-base">
              Your Name *
            </Label>
            <Input
              id="stocked-out-by"
              placeholder="Enter your name"
              value={hook.stockOutBy}
              onChange={(e) => hook.setStockOutBy(e.target.value)}
              className="h-11 text-base"
              required
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Sticky header with label and search */}
            <div className="sticky top-0 bg-white z-10 pb-3 mb-2">
              <Label className="text-base mb-2.5 block">
                Available Items ({availableCount} items)
              </Label>
              
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F58220] w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={hook.searchQuery}
                  onChange={(e) => hook.setSearchQuery(e.target.value)}
                  className="h-11 pl-10 text-base bg-white border-gray-300"
                />
              </div>
            </div>
            
            <div className="flex-1 border rounded-lg overflow-auto min-h-0 custom-scrollbar -mx-1 px-1">
              <div className="p-2 space-y-1.5">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1681688764682-7992498c6338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGJveCUyMHdhcmVob3VzZXxlbnwxfHx8fDE3NjU5NzY2MTB8MA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Empty inventory"
                      className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover opacity-50"
                    />
                    <p className="font-medium text-gray-700 mb-1">
                      {hook.searchQuery.trim() 
                        ? "No items match your search" 
                        : "No items available"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {hook.searchQuery.trim() 
                        ? "Try a different search term" 
                        : "All items are currently depleted"}
                    </p>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const isSelected = hook.selectedItems[item.id] !== undefined;
                    const selectedQty = hook.selectedItems[item.id] || 0;
                    const hasError = selectedQty > item.quantity;
                    const remainingQty = item.quantity - selectedQty;

                    return (
                      <div
                        key={item.id}
                        className={`border rounded-lg p-2.5 transition-all cursor-pointer ${
                          isSelected ? "border-[#F58220] bg-orange-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        } ${hasError ? "border-red-500 bg-red-50" : ""}`}
                        onClick={() => hook.toggleItemSelection(item.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => hook.toggleItemSelection(item.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium leading-tight truncate">{item.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                  <span className="font-mono">{item.batchNumber}</span>
                                  <span>•</span>
                                  <span className={getExpiryTextColor(item.status)}>
                                    {item.expiry ? formatDate(item.expiry) : "No expiry"}
                                  </span>
                                </div>
                              </div>
                              <div className={`text-sm shrink-0 ${remainingQty < item.quantity ? 'text-[#F58220] font-semibold' : 'text-gray-600'}`}>
                                Avail: <span className="font-medium">{remainingQty}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="mt-2 pl-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-gray-700">Qty to stock out:</span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-11 w-11 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    hook.changeQuantity(item.id, Math.max(0, selectedQty - 1));
                                  }}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <div className={`w-14 flex items-center justify-center h-11 border-2 rounded-md font-medium ${
                                  hasError ? "border-red-500 bg-red-50 text-red-700" : "border-gray-300"
                                }`}>
                                  {selectedQty}
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-11 w-11 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    hook.changeQuantity(item.id, Math.min(item.quantity, selectedQty + 1));
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {hasError && (
                              <p className="text-xs text-red-600 text-right mt-1">
                                Exceeds available
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {hook.selectedCount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5">
              <p className="text-sm font-medium text-orange-900">
                Selected: {hook.selectedCount} items, Total: {hook.totalUnits} units
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 px-6 py-4 border-t flex-row">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={hook.closeDialog}
              className="h-12 flex-1 text-base"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={hook.openConfirmation}
            disabled={hook.isStockingOut || hook.selectedCount === 0 || !hook.stockOutBy.trim()}
            className="h-12 flex-1 text-base"
          >
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
