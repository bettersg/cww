import { 
  AlertCircle, 
  CheckCircle, 
  PackageX 
} from "lucide-react";

/**
 * Format dates as DD/MM/YYYY
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "No expiry";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Calculate days until expiry
 */
export const getDaysUntilExpiry = (expiryDate: string | null): number | null => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Determine item status based on expiry date, threshold, and quantity
 */
export const getItemStatus = (
  expiryDate: string | null,
  threshold: number = 7,
  quantity: number = 1,
): "fresh" | "expiring" | "expired" | "depleted" => {
  if (quantity === 0) return "depleted";
  
  // Items without expiry date are always fresh
  if (!expiryDate) return "fresh";
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= threshold) return "expiring";
  return "fresh";
};

/**
 * Get expiry icon based on status
 */
export const getExpiryIcon = (status: string) => {
  switch (status) {
    case "expired":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    case "expiring":
      return <AlertCircle className="w-4 h-4 text-orange-600" />;
    case "fresh":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "depleted":
      return <PackageX className="w-4 h-4 text-gray-400" />;
    default:
      return null;
  }
};

/**
 * Get expiry text color based on status
 */
export const getExpiryTextColor = (status: string) => {
  switch (status) {
    case "expired":
      return "text-red-600";
    case "expiring":
      return "text-orange-600";
    case "fresh":
      return "text-gray-600";
    case "depleted":
      return "text-gray-400";
    default:
      return "text-gray-600";
  }
};

/**
 * Generate a unique batch number for an item
 */
export const generateBatchNumber = (name: string, existingCount: number): string => {
  const prefix = name
    .substring(0, 4)
    .toUpperCase()
    .replace(/[^A-Z]/g, "X");
  return `${prefix}-${String(existingCount + 1).padStart(3, "0")}`;
};

/**
 * Calculate stats from items array
 */
export const calculateStats = (items: Array<{ status: string }>) => {
  const fresh = items.filter((item) => item.status === "fresh").length;
  const expiring = items.filter((item) => item.status === "expiring").length;
  const expired = items.filter((item) => item.status === "expired").length;
  const depleted = items.filter((item) => item.status === "depleted").length;
  
  return { fresh, expiring, expired, depleted };
};
