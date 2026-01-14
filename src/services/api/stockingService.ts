/**
 * Stocking Service
 * API calls for stock-in (adding) and stock-out (removing) inventory
 */

import type { StockOutItem } from '../../types';
import { apiRequest } from './client';

export const stockingService = {
  /**
   * Stock out items - batch operation to remove quantities from inventory
   * @param items - Array of items with quantities to stock out
   * @param stockedOutBy - Name of person performing stock out
   */
  async stockOutItems(items: StockOutItem[], stockedOutBy: string): Promise<any> {
    return await apiRequest<any>('/stock-out', {
      method: 'POST',
      body: JSON.stringify({ items, stockedOutBy }),
    });
  },

  /**
   * Batch distribute items (legacy - may be deprecated)
   * @param itemIds - Array of item IDs to distribute
   * @param quantities - Array of quantities matching itemIds
   * @param distributedBy - Name of person distributing
   */
  async distributeItems(
    itemIds: string[],
    quantities: number[],
    distributedBy: string
  ): Promise<any> {
    return await apiRequest<any>('/distribute', {
      method: 'POST',
      body: JSON.stringify({ itemIds, quantities, distributedBy }),
    });
  },
};