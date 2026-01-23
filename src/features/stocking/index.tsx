import React from 'react';
import { StockOutDialog } from './components/StockOutDialog';
import { StockOutConfirmation } from './components/StockOutConfirmation';
import type { InventoryItem } from '../../types';
import type { UseStockOutReturn } from './hooks/useStockOut';

interface StockingFeatureProps {
  hook: UseStockOutReturn;
  items: InventoryItem[];
  onStockOutComplete: (result: any) => void;
}

export function StockingFeature({ hook, items, onStockOutComplete }: StockingFeatureProps) {
  const handleConfirm = async () => {
    const result = await hook.executeStockOut(items);
    if (result) {
      onStockOutComplete(result);
    }
  };


  return (
    <>
      <StockOutDialog hook={hook} items={items} />
      <StockOutConfirmation hook={hook} items={items} onConfirm={handleConfirm} />
    </>
  );
}

// Re-export the hook for convenience
export { useStockOut } from './hooks/useStockOut';
export type { UseStockOutReturn } from './hooks/useStockOut';
