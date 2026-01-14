import { useState, useMemo } from 'react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../../services/api';
import type { InventoryItem } from '../../../types';

export interface UseStockOutReturn {
  // Dialog state
  isDialogOpen: boolean;
  isConfirmationOpen: boolean;
  isStockingOut: boolean;
  
  // Form state
  selectedItems: Record<string, number>;
  stockOutBy: string;
  searchQuery: string;
  
  // Actions
  openDialog: () => void;
  closeDialog: () => void;
  openConfirmation: () => void;
  closeConfirmation: () => void;
  setStockOutBy: (name: string) => void;
  setSearchQuery: (query: string) => void;
  toggleItemSelection: (itemId: string) => void;
  changeQuantity: (itemId: string, quantity: number) => void;
  executeStockOut: (items: InventoryItem[]) => Promise<void>;
  resetSelection: () => void;
  
  // Computed
  getFilteredItems: (allItems: InventoryItem[]) => InventoryItem[];
  selectedCount: number;
  totalUnits: number;
}

export function useStockOut(): UseStockOutReturn {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [stockOutBy, setStockOutBy] = useState("");
  const [isStockingOut, setIsStockingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openDialog = () => setIsDialogOpen(true);
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItems({});
    setStockOutBy("");
    setSearchQuery("");
  };

  const openConfirmation = () => setIsConfirmationOpen(true);
  const closeConfirmation = () => setIsConfirmationOpen(false);

  const resetSelection = () => {
    setSelectedItems({});
    setStockOutBy("");
    setSearchQuery("");
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSelection = { ...prev };
      if (newSelection[itemId]) {
        delete newSelection[itemId];
      } else {
        // Default to 1 when selecting
        newSelection[itemId] = 1;
      }
      return newSelection;
    });
  };

  const changeQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) return;
    
    setSelectedItems((prev) => {
      const newSelection = { ...prev };
      if (quantity === 0) {
        delete newSelection[itemId];
      } else {
        newSelection[itemId] = quantity;
      }
      return newSelection;
    });
  };

  const executeStockOut = async (items: InventoryItem[]) => {
    if (!stockOutBy.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const stockOutItems = Object.entries(selectedItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({ id, quantity }));

    if (stockOutItems.length === 0) {
      toast.error("Please select items and enter quantities to stock out");
      return;
    }

    try {
      setIsStockingOut(true);
      const result = await api.stockOutItems(stockOutItems, stockOutBy.trim());
      
      // Show success message
      let message = result.message || `Successfully stocked out ${stockOutItems.length} items`;
      if (result.errors && result.errors.length > 0) {
        message += `. ${result.errors.length} items had errors.`;
        result.errors.forEach((error: any) => {
          toast.error(`${error.name || error.id}: ${error.error}`);
        });
      }
      toast.success(message);

      // Reset and close dialog
      resetSelection();
      setIsDialogOpen(false);
      
      // Return the result so parent can update items
      return result;
    } catch (error) {
      console.error("Error stocking out items:", error);
      toast.error("Failed to stock out items. Please try again.");
    } finally {
      setIsStockingOut(false);
    }
  };

  const getFilteredItems = (allItems: InventoryItem[]) => {
    const availableItems = allItems.filter(item => {
      if (item.quantity <= 0) return false;
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.batchNumber.toLowerCase().includes(query)
      );
    });
    
    // Sort: selected items first, then by name
    return availableItems.sort((a, b) => {
      const aSelected = selectedItems[a.id] !== undefined;
      const bSelected = selectedItems[b.id] !== undefined;
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const selectedCount = Object.keys(selectedItems).length;
  const totalUnits = Object.values(selectedItems).reduce((a, b) => a + b, 0);

  return {
    // Dialog state
    isDialogOpen,
    isConfirmationOpen,
    isStockingOut,
    
    // Form state
    selectedItems,
    stockOutBy,
    searchQuery,
    
    // Actions
    openDialog,
    closeDialog,
    openConfirmation,
    closeConfirmation,
    setStockOutBy,
    setSearchQuery,
    toggleItemSelection,
    changeQuantity,
    executeStockOut,
    resetSelection,
    
    // Computed
    getFilteredItems,
    selectedCount,
    totalUnits,
  };
}
