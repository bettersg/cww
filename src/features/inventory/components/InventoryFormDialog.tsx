import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from '../../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import type { UseInventoryReturn } from '../hooks/useInventory';

interface InventoryFormDialogProps {
  hook: UseInventoryReturn;
  onSubmit: (e: React.FormEvent) => void;
}

export function InventoryFormDialog({ hook, onSubmit }: InventoryFormDialogProps) {
  return (
    <Dialog
      open={hook.isAddDialogOpen}
      onOpenChange={(open) => {
        if (!open) hook.closeAddDialog();
      }}
    >
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">
              {hook.editingItem ? "Edit Item" : "Add Item"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {hook.editingItem
                ? "Update the item details below."
                : "Fill in the details to add to inventory."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pb-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base">
                Item Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter item name"
                value={hook.formData.name}
                onChange={(e) => {
                  hook.updateFormData('name', e.target.value);
                  if (hook.formErrors.name) {
                    hook.clearFormError('name');
                  }
                }}
                className={`h-12 text-base ${hook.formErrors.name ? "border-red-500" : ""}`}
                aria-invalid={!!hook.formErrors.name}
              />
              {hook.formErrors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {hook.formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter item description (optional)"
                value={hook.formData.description}
                onChange={(e) => hook.updateFormData('description', e.target.value)}
                className="min-h-20 text-base"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="quantity" className="text-base">
                Quantity *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                placeholder="Enter quantity"
                value={hook.formData.quantity}
                onChange={(e) => {
                  hook.updateFormData('quantity', e.target.value);
                  if (hook.formErrors.quantity) {
                    hook.clearFormError('quantity');
                  }
                }}
                className={`h-12 text-base ${hook.formErrors.quantity ? "border-red-500" : ""}`}
                aria-invalid={!!hook.formErrors.quantity}
              />
              {hook.formErrors.quantity && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {hook.formErrors.quantity}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="expiry" className="text-base">
                Expiry Date {!hook.formData.hasNoExpiry && "*"}
              </Label>
              <div className="relative">
                <Input
                  id="expiry"
                  type="date"
                  value={hook.formData.expiry}
                  onChange={(e) => {
                    hook.updateFormData('expiry', e.target.value);
                    if (hook.formErrors.expiry) {
                      hook.clearFormError('expiry');
                    }
                  }}
                  className={`h-12 text-base ${hook.formErrors.expiry ? "border-red-500" : ""}`}
                  aria-invalid={!!hook.formErrors.expiry}
                  disabled={hook.formData.hasNoExpiry}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
              {hook.formErrors.expiry && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {hook.formErrors.expiry}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no-expiry"
                  checked={hook.formData.hasNoExpiry}
                  onCheckedChange={(checked) => {
                    hook.updateFormData('hasNoExpiry', checked as boolean);
                    if (checked) {
                      hook.updateFormData('expiry', '');
                      if (hook.formErrors.expiry) {
                        hook.clearFormError('expiry');
                      }
                    }
                  }}
                />
                <label
                  htmlFor="no-expiry"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  This item has no expiry date
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="expiring-threshold" className="text-base">
                Mark as Expiring When {!hook.formData.hasNoExpiry && "*"}
              </Label>
              <Select
                value={hook.formData.expiringThreshold}
                onValueChange={(value) => hook.updateFormData('expiringThreshold', value)}
                disabled={hook.formData.hasNoExpiry}
              >
                <SelectTrigger className="h-12 text-base" id="expiring-threshold" disabled={hook.formData.hasNoExpiry}>
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1 Week Before Expiry</SelectItem>
                  <SelectItem value="30">1 Month Before Expiry</SelectItem>
                  <SelectItem 
                    value="180"
                    disabled={(() => {
                      if (!hook.formData.expiry) return false;
                      const today = new Date();
                      const expiry = new Date(hook.formData.expiry);
                      const diffTime = expiry.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 180;
                    })()}
                  >
                    6 Months Before Expiry
                  </SelectItem>
                </SelectContent>
              </Select>
              {hook.formData.expiry && (() => {
                const today = new Date();
                const expiry = new Date(hook.formData.expiry);
                const diffTime = expiry.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 180 && diffDays >= 0) {
                  return (
                    <p className="text-xs text-gray-500 mt-1">
                      6 months option disabled (expiry is within 6 months)
                    </p>
                  );
                }
                return null;
              })()}
              {hook.formData.hasNoExpiry && (
                <p className="text-xs text-gray-500 mt-1">
                  Item will always be marked as fresh (not applicable for items without expiry)
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="donor" className="text-base">
                Donor/Source
              </Label>
              <Input
                id="donor"
                placeholder="Enter donor name (optional)"
                value={hook.formData.donor}
                onChange={(e) => hook.updateFormData('donor', e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="modified-by" className="text-base">
                {hook.editingItem ? "Modified By *" : "Added By *"}
              </Label>
              <Input
                id="modified-by"
                placeholder="Enter your name"
                value={hook.formData.modifiedBy}
                onChange={(e) => {
                  hook.updateFormData('modifiedBy', e.target.value);
                  if (hook.formErrors.modifiedBy) {
                    hook.clearFormError('modifiedBy');
                  }
                }}
                className={`h-12 text-base ${hook.formErrors.modifiedBy ? "border-red-500" : ""}`}
                aria-invalid={!!hook.formErrors.modifiedBy}
              />
              {hook.formErrors.modifiedBy && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {hook.formErrors.modifiedBy}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t sm:flex-row flex-col-reverse">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={hook.resetForm}
                className="h-14 sm:h-12 w-full sm:flex-1 text-base"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-14 sm:h-12 w-full sm:flex-1 text-base"
            >
              {hook.editingItem ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
