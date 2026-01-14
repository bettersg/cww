/**
 * Audit Log Clear Confirmation Dialog
 * Confirms before clearing all audit log entries
 */

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';

interface AuditLogClearConfirmProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  entryCount: number;
  isClearing: boolean;
}

export function AuditLogClearConfirm({
  isOpen,
  onOpenChange,
  onConfirm,
  entryCount,
  isClearing,
}: AuditLogClearConfirmProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Audit Log?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all {entryCount} audit log entries. This
            action cannot be undone.
            <br />
            <br />
            <strong>Note:</strong> Consider exporting the audit log before
            clearing it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isClearing}
            className="bg-red-600 hover:bg-red-700"
          >
            {isClearing ? 'Clearing...' : 'Clear Log'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
