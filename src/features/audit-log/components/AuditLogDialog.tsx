/**
 * Audit Log Dialog Component
 * Displays complete history of inventory changes with search and export
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Search, Download, Trash2, Clock, History } from 'lucide-react';
import { AuditLogTimeline } from './AuditLogTimeline';

interface AuditLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entries: any[];
  filteredEntries: any[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport: () => void;
  onClearRequest: () => void;
}

export function AuditLogDialog({
  isOpen,
  onClose,
  entries,
  filteredEntries,
  isLoading,
  searchQuery,
  onSearchChange,
  onExport,
  onClearRequest,
}: AuditLogDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-4xl w-[calc(100%-2rem)] max-h-[90vh] flex flex-col p-0"
        aria-describedby={undefined}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
          <DialogTitle className="text-xl">Audit Log</DialogTitle>
          <DialogDescription className="text-base">
            Complete history of all inventory changes
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto custom-scrollbar px-6 py-4">
          {/* Search and Export */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by item name or batch number..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearRequest}
              className="h-10"
              disabled={entries.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Log
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Clock className="w-8 h-8 text-[#F58220] animate-pulse" />
                <p className="text-gray-600">Loading audit log...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">No Activity Yet</h3>
              <p className="text-sm text-gray-600">
                Inventory changes will appear here
              </p>
            </div>
          )}

          {/* Changelog Entries */}
          {!isLoading && entries.length > 0 && (
            <AuditLogTimeline entries={filteredEntries} />
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 px-6 text-base"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
