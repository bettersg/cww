/**
 * Audit Log Service
 * API calls for changelog/audit log operations
 */

import type { ChangelogEntry } from '../../types';
import { apiRequest, API_BASE_URL } from './client';

export const auditLogService = {
  /**
   * Get all changelog entries
   */
  async getChangelog(): Promise<ChangelogEntry[]> {
    const data = await apiRequest<{ entries: ChangelogEntry[] }>('/changelog', {
      method: 'GET',
    });
    return data.entries || [];
  },

  /**
   * Get changelog export URL for CSV download
   */
  getChangelogExportUrl(): string {
    return `${API_BASE_URL}/changelog/export`;
  },

  /**
   * Clear all changelog entries
   * @returns Number of entries deleted
   */
  async clearChangelog(): Promise<number> {
    const data = await apiRequest<{ entriesDeleted: number }>('/changelog', {
      method: 'DELETE',
    });
    return data.entriesDeleted || 0;
  },
};