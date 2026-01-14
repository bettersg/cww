/**
 * Audit Log Feature
 * Complete audit log functionality with dialog, timeline, and clear confirmation
 */

import React from 'react';
import { useAuditLog } from './hooks/useAuditLog';
import { AuditLogDialog } from './components/AuditLogDialog';
import { AuditLogClearConfirm } from './components/AuditLogClearConfirm';

interface AuditLogFeatureProps {
  /** Hook instance from parent (required for shared state) */
  hook: ReturnType<typeof useAuditLog>;
}

export function AuditLogFeature({ hook }: AuditLogFeatureProps) {
  const {
    isDialogOpen,
    entries,
    filteredEntries,
    isLoading,
    searchQuery,
    showClearConfirm,
    isClearing,
    setSearchQuery,
    setShowClearConfirm,
    closeDialog,
    exportChangelog,
    clearChangelog,
  } = hook;

  return (
    <>
      <AuditLogDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        entries={entries}
        filteredEntries={filteredEntries}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExport={exportChangelog}
        onClearRequest={() => setShowClearConfirm(true)}
      />

      <AuditLogClearConfirm
        isOpen={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        onConfirm={clearChangelog}
        entryCount={entries.length}
        isClearing={isClearing}
      />
    </>
  );
}

// Export hook for external use
export { useAuditLog } from './hooks/useAuditLog';