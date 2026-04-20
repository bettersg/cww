import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../../services/api';
import type { InventoryItem } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';

export interface InventoryFormData {
  name: string;
  description: string;
  quantity: string;
  expiry: string;
  donor: string;
  expiringThreshold: string;
  hasNoExpiry: boolean;
}

export interface InventoryFormErrors {
  name: string;
  quantity: string;
  expiry: string;
}

export interface UseInventoryReturn {
  // Dialog state
  isAddDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  
  // Form state
  formData: InventoryFormData;
  formErrors: InventoryFormErrors;
  editingItem: InventoryItem | null;
  itemToDelete: string | null;
  
  // Actions
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (item: InventoryItem) => void;
  openDuplicateDialog: (item: InventoryItem) => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  updateFormData: (field: keyof InventoryFormData, value: any) => void;
  clearFormError: (field: keyof InventoryFormErrors) => void;
  submitItem: (
    items: InventoryItem[], 
    generateBatchNumber: (name: string) => string,
    getItemStatus: (expiry: string | null, threshold: number, quantity: number) => string
  ) => Promise<InventoryItem | null>;
  deleteItem: () => Promise<boolean>;
  resetForm: () => void;
}

const initialFormData: InventoryFormData = {
  name: "",
  description: "",
  quantity: "",
  expiry: "",
  donor: "",
  expiringThreshold: "7",
  hasNoExpiry: false,
};

const initialFormErrors: InventoryFormErrors = {
  name: "",
  quantity: "",
  expiry: "",
};

export function useInventory(): UseInventoryReturn {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<InventoryFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<InventoryFormErrors>(initialFormErrors);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const openAddDialog = () => setIsAddDialogOpen(true);
  
  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors(initialFormErrors);
    setEditingItem(null);
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity.toString(),
      expiry: item.expiry || "",
      donor: item.donor || "",
      expiringThreshold: item.expiringThreshold.toString(),
      hasNoExpiry: !item.expiry,
    });
    setFormErrors(initialFormErrors);
    setIsAddDialogOpen(true);
  };

  const openDuplicateDialog = (item: InventoryItem) => {
    setEditingItem(null); // Set to null so it creates a new item
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity.toString(),
      expiry: item.expiry || "",
      donor: item.donor || "",
      expiringThreshold: item.expiringThreshold.toString(),
      hasNoExpiry: !item.expiry,
    });
    setFormErrors(initialFormErrors);
    setIsAddDialogOpen(true);
    toast.info("Creating duplicate item - modify as needed");
  };

  const openDeleteDialog = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const updateFormData = (field: keyof InventoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearFormError = (field: keyof InventoryFormErrors) => {
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const submitItem = async (
    items: InventoryItem[],
    generateBatchNumber: (name: string) => string,
    getItemStatus: (expiry: string | null, threshold: number, quantity: number) => string
  ): Promise<InventoryItem | null> => {
    // Clear previous errors
    const errors: InventoryFormErrors = {
      name: "",
      quantity: "",
      expiry: "",
    };

    // Validate fields
    let hasErrors = false;

    if (!formData.name.trim()) {
      errors.name = "Item name is required";
      hasErrors = true;
    }

    if (!formData.quantity) {
      errors.quantity = "Quantity is required";
      hasErrors = true;
    } else {
      const quantity = parseInt(formData.quantity);
      if (quantity < 0) {
        errors.quantity = "Quantity cannot be negative";
        hasErrors = true;
      }
    }

    if (!formData.hasNoExpiry && !formData.expiry) {
      errors.expiry = "Expiry date is required (or check 'No expiry')";
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      toast.error("Please fix the errors in the form");
      return null;
    }

    const quantity = parseInt(formData.quantity);
    const threshold = parseInt(formData.expiringThreshold);
    const expiryValue = formData.hasNoExpiry ? null : formData.expiry;
    const status = getItemStatus(expiryValue, threshold, quantity);
    const currentDate = new Date().toISOString().split("T")[0];

    try {
      if (editingItem) {
        const updates = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          quantity,
          expiry: expiryValue,
          status,
          expiringThreshold: threshold,
          lastModifiedBy: user?.name || "System",
          lastModifiedDate: currentDate,
        };
        
        const updatedItem = await api.updateItem(editingItem.id, updates);
        toast.success("Item updated successfully");
        closeAddDialog();
        return updatedItem;
      } else {
        const newItem: any = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          quantity,
          expiry: expiryValue,
          status,
          batchNumber: generateBatchNumber(formData.name.trim()),
          receivedDate: currentDate,
          donor: formData.donor.trim() || undefined,
          lastModifiedBy: user?.name || "System",
          lastModifiedDate: currentDate,
          expiringThreshold: threshold,
        };
        
        const createdItem = await api.createItem(newItem);
        toast.success("Item added successfully");
        closeAddDialog();
        return createdItem;
      }
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save item. Please try again.");
      return null;
    }
  };

  const deleteItem = async (): Promise<boolean> => {
    if (!itemToDelete) return false;

    try {
      await api.deleteItem(itemToDelete);
      toast.success("Item deleted successfully");
      closeDeleteDialog();
      return true;
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
      closeDeleteDialog();
      return false;
    }
  };

  return {
    // Dialog state
    isAddDialogOpen,
    isDeleteDialogOpen,
    
    // Form state
    formData,
    formErrors,
    editingItem,
    itemToDelete,
    
    // Actions
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    openDuplicateDialog,
    openDeleteDialog,
    closeDeleteDialog,
    updateFormData,
    clearFormError,
    submitItem,
    deleteItem,
    resetForm,
  };
}
