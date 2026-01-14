/**
 * Audit Log Hook
 * Manages audit log state and operations
 */

import { useState } from 'react';
import { api } from '../../../utils/api';
import { toast } from 'sonner@2.0.3';
import type { ChangelogEntry } from '../../../types';

export function useAuditLog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  /**
   * Load changelog entries from API
   */
  const loadChangelog = async () => {
    try {
      setIsLoading(true);
      const data = await api.getChangelog();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load changelog:', error);
      toast.error('Failed to load audit log');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Open dialog and load entries
   */
  const openDialog = () => {
    setIsDialogOpen(true);
    loadChangelog();
  };

  /**
   * Close dialog and reset search
   */
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSearchQuery('');
  };

  /**
   * Export changelog as CSV
   */
  const exportChangelog = () => {
    const exportUrl = api.getChangelogExportUrl();
    window.open(exportUrl, '_blank');
    toast.success('Audit log export started!');
  };

  /**
   * Clear all changelog entries
   */
  const clearChangelog = async () => {
    try {
      setIsClearing(true);
      const count = await api.clearChangelog();
      setEntries([]);
      setShowClearConfirm(false);
      toast.success(`Cleared ${count} audit log entries`);
    } catch (error) {
      console.error('Failed to clear changelog:', error);
      toast.error('Failed to clear audit log');
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * Filter entries by search query
   */
  const filteredEntries = entries.filter((entry) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.itemName?.toLowerCase().includes(query) ||
      entry.batchNumber?.toLowerCase().includes(query)
    );
  });

  return {
    isDialogOpen,
    entries,
    filteredEntries,
    isLoading,
    searchQuery,
    showClearConfirm,
    isClearing,
    setSearchQuery,
    setShowClearConfirm,
    openDialog,
    closeDialog,
    exportChangelog,
    clearChangelog,
  };
}