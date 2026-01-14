import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog';
import type { InventoryItem } from '../../../types';
import type { UseInventoryReturn } from '../hooks/useInventory';

interface DeleteConfirmationProps {
  hook: UseInventoryReturn;
  items: InventoryItem[];
  onConfirm: () => void;
}

export function DeleteConfirmation({ hook, items, onConfirm }: DeleteConfirmationProps) {
  const itemToDeleteName = hook.itemToDelete 
    ? items.find((item) => item.id === hook.itemToDelete)?.name 
    : null;

  return (
    <AlertDialog
      open={hook.isDeleteDialogOpen}
      onOpenChange={hook.closeDeleteDialog}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Item</AlertDialogTitle>
          <AlertDialogDescription>
            {hook.itemToDelete && (
              <>
                Are you sure you want to delete "{itemToDeleteName}"? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="h-12 md:h-10 flex-1">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 h-12 md:h-10 flex-1"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
