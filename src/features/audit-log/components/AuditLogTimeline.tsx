/**
 * Audit Log Timeline Component
 * Displays changelog entries in a timeline view
 */

import React from 'react';
import { Plus, Trash2, Minus, Edit } from 'lucide-react';

interface AuditLogTimelineProps {
  entries: any[];
}

export function AuditLogTimeline({ entries }: AuditLogTimelineProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'ITEM_ADDED':
        return <Plus className="w-5 h-5" />;
      case 'ITEM_DELETED':
        return <Trash2 className="w-5 h-5" />;
      case 'STOCK_OUT':
        return <Minus className="w-5 h-5" />;
      case 'ITEM_UPDATED':
        return <Edit className="w-5 h-5" />;
      default:
        return <Edit className="w-5 h-5" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'ITEM_ADDED':
        return 'text-green-600';
      case 'ITEM_DELETED':
        return 'text-red-600';
      case 'STOCK_OUT':
        return 'text-orange-600';
      case 'ITEM_UPDATED':
        return 'text-blue-600';
      default:
        return 'text-blue-600';
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'ITEM_ADDED':
        return 'bg-green-100 text-green-700';
      case 'ITEM_DELETED':
        return 'bg-red-100 text-red-700';
      case 'STOCK_OUT':
        return 'bg-orange-100 text-orange-700';
      case 'ITEM_UPDATED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Icon based on action */}
              <div className={`mt-0.5 shrink-0 ${getActionColor(entry.action)}`}>
                {getActionIcon(entry.action)}
              </div>

              {/* Entry details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionBadgeColor(
                      entry.action
                    )}`}
                  >
                    {entry.action.replace(/_/g, ' ')}
                  </span>
                  {entry.batchNumber && (
                    <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      {entry.batchNumber}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 truncate">
                  {entry.itemName}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 flex-wrap">
                  <span>
                    {new Date(entry.timestamp).toLocaleDateString('en-GB')}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(entry.timestamp).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {entry.performedBy && (
                    <>
                      <span>•</span>
                      <span>by {entry.performedBy}</span>
                    </>
                  )}
                </div>
                {entry.fieldsChanged && entry.fieldsChanged.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-medium">Changed:</span>{' '}
                    {entry.fieldsChanged.join(', ')}
                  </div>
                )}
                {entry.snapshot && (
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                    {entry.snapshot.quantity !== undefined && (
                      <span>
                        Qty:{' '}
                        <span className="font-medium">
                          {entry.snapshot.quantity}
                        </span>
                      </span>
                    )}
                    {entry.snapshot.expiry && (
                      <span>
                        Expiry:{' '}
                        <span className="font-medium">
                          {new Date(entry.snapshot.expiry).toLocaleDateString(
                            'en-GB'
                          )}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
