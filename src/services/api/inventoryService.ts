/**
 * Inventory Service
 * API calls for inventory management (CRUD operations)
 */

import type { InventoryItem } from '../../types';
import { apiRequest } from './client';

export const inventoryService = {
  /**
   * Get all inventory items
   */
  async getAllItems(): Promise<InventoryItem[]> {
    const data = await apiRequest<{ items: InventoryItem[] }>('/items', {
      method: 'GET',
    });
    return data.items || [];
  },

  /**
   * Get single item by ID
   */
  async getItem(id: string): Promise<InventoryItem> {
    const data = await apiRequest<{ item: InventoryItem }>(`/items/${id}`, {
      method: 'GET',
    });
    return data.item;
  },

  /**
   * Create new inventory item
   */
  async createItem(item: InventoryItem): Promise<InventoryItem> {
    // Remove 'id' if present - server will generate it
    const { id, ...itemData } = item;
    
    const data = await apiRequest<{ item: InventoryItem }>('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    return data.item;
  },

  /**
   * Update existing item
   */
  async updateItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    const data = await apiRequest<{ item: InventoryItem }>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.item;
  },

  /**
   * Delete item
   */
  async deleteItem(id: string): Promise<void> {
    await apiRequest<void>(`/items/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Initialize database with sample data
   */
  async initializeDatabase(): Promise<any> {
    return await apiRequest<any>('/initialize', {
      method: 'POST',
    });
  },
};