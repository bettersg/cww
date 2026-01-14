import React from 'react';
import { InventoryFormDialog } from './components/InventoryFormDialog';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import type { InventoryItem } from '../../types';
import type { UseInventoryReturn } from './hooks/useInventory';

interface InventoryFeatureProps {
  hook: UseInventoryReturn;
  items: InventoryItem[];
  generateBatchNumber: (name: string) => string;
  getItemStatus: (expiry: string | null, threshold: number, quantity: number) => string;
  onItemCreated: (item: InventoryItem) => void;
  onItemUpdated: (item: InventoryItem) => void;
  onItemDeleted: (id: string) => void;
}

export function InventoryFeature({ 
  hook, 
  items, 
  generateBatchNumber, 
  getItemStatus,
  onItemCreated,
  onItemUpdated,
  onItemDeleted,
}: InventoryFeatureProps) {
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await hook.submitItem(items, generateBatchNumber, getItemStatus);
    if (result) {
      if (hook.editingItem) {
        onItemUpdated(result);
      } else {
        onItemCreated(result);
      }
    }
  };

  const handleDelete = async () => {
    const success = await hook.deleteItem();
    if (success && hook.itemToDelete) {
      onItemDeleted(hook.itemToDelete);
    }
  };

  return (
    <>
      <InventoryFormDialog hook={hook} onSubmit={handleSubmit} />
      <DeleteConfirmation hook={hook} items={items} onConfirm={handleDelete} />
    </>
  );
}

// Re-export the hook for convenience
export { useInventory } from './hooks/useInventory';
export type { UseInventoryReturn } from './hooks/useInventory';
