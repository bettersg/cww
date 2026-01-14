/**
 * CSV Export Utilities
 * Export inventory data to CSV format
 */

import type { ExportItem } from '../../types';
import { formatDate } from './dateFormatter';

/**
 * Escape CSV values to prevent injection and formatting issues
 * @param value - String value to escape
 * @returns Escaped CSV value
 */
const escapeCSV = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/**
 * Export inventory items to CSV file
 * @param items - Array of items to export
 * @param filename - Optional custom filename (default: pantrykeeper-inventory.csv)
 */
export function exportToCSV(
  items: ExportItem[],
  filename: string = "pantrykeeper-inventory.csv"
): void {
  // Define CSV headers
  const headers = [
    "Item Name",
    "Description",
    "Quantity",
    "Status",
    "Batch Number",
    "Expiry Date",
    "Received Date",
    "Donor",
    "Last Modified By",
    "Last Modified Date"
  ];

  // Convert items to CSV rows
  const rows = items.map(item => [
    item.name,
    item.description || "",
    item.quantity.toString(),
    item.status.charAt(0).toUpperCase() + item.status.slice(1),
    item.batchNumber,
    formatDate(item.expiry),
    formatDate(item.receivedDate),
    item.donor || "",
    item.lastModifiedBy || "",
    item.lastModifiedDate ? formatDate(item.lastModifiedDate) : ""
  ]);

  // Build CSV content
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export changelog/audit log entries to CSV
 * @param entries - Array of changelog entries
 * @param filename - Optional custom filename
 */
export function exportChangelogToCSV(
  entries: any[],
  filename: string = "pantrykeeper-audit-log.csv"
): void {
  const headers = [
    "Timestamp",
    "Action",
    "Item Name",
    "Batch Number",
    "Modified By",
    "Changes"
  ];

  const rows = entries.map(entry => [
    formatDate(entry.timestamp),
    entry.action,
    entry.itemName || "",
    entry.batchNumber || "",
    entry.userId || "",
    entry.changes ? JSON.stringify(entry.changes) : ""
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}