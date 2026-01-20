import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  AlertCircle,
  Calendar,
  Package,
  MoreVertical,
  Trash2,
  Edit,
  FileText,
  PackageX,
  Minus,
  X,
  Download,
  Copy,
  MoreHorizontal,
  History,
  CheckCircle,
  User,
  LogOut,
  KeyRound,
  Menu,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { PantryKeeperLogo } from "./components/PantryKeeperLogo";
import { ScrollArea } from "./components/ui/scroll-area";
import { api } from "./utils/api";
import { checkServerHealth } from "./services/api/client";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { exportToCSV } from "./utils/exportHelpers";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { HowToGuide } from "./components/HowToGuide";
import { AuditLogFeature, useAuditLog } from "./features/audit-log";
import { StockingFeature, useStockOut } from "./features/stocking";
import { InventoryFeature, useInventory } from "./features/inventory";
import {
  useSearchFilter,
  useFilteredItems,
  FilterBar,
  StatsCards,
} from "./features/search-filter";
import { InventoryDisplay } from "./features/inventory-display";
import { UserGuideDialog } from "./features/user-guide";
import { useExportActions } from "./features/export-actions";
import { getItemStatus, calculateStats } from "./utils/inventoryHelpers";
import { AuthPages } from "./components/auth/AuthPages";
import { ChangePasswordDialog } from "./components/auth/ChangePasswordDialog";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  expiry: string | null; // Allow null for items without expiry
  status: "fresh" | "expiring" | "expired" | "depleted";
  batchNumber: string;
  receivedDate: string;
  donor?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  expiringThreshold: number; // in days
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [userGuideOpen, setUserGuideOpen] = useState(false);
  const [showHowToGuide, setShowHowToGuide] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Search & Filter feature (extracted)
  const searchFilter = useSearchFilter();

  // Audit log feature (extracted)
  const auditLog = useAuditLog();

  // Stocking feature (extracted)
  const stockOut = useStockOut();

  // Inventory feature (extracted)
  const inventory = useInventory();

  // Export actions feature (extracted)
  const exportActions = useExportActions();

  const handleLogin = (user: { name: string; email: string }) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setItems([]);
  };

  // Load items from backend on mount
  useEffect(() => {
    const loadItems = async () => {
      // Only load items if authenticated
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedItems = await api.getAllItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error("Failed to load inventory items:", error);
        toast.error("Failed to load inventory. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [isAuthenticated]);

  // Recalculate status dynamically based on current date and quantity
  const itemsWithCurrentStatus = useMemo(() => {
    return items.map((item) => ({
      ...item,
      status: getItemStatus(item.expiry, item.expiringThreshold, item.quantity),
    }));
  }, [items]);

  // Apply search and filter using extracted feature
  const filteredItems = useFilteredItems({
    items: itemsWithCurrentStatus,
    searchTerm: searchFilter.searchTerm,
    filterStatus: searchFilter.filterStatus,
  });

  // Calculate stats using shared utility
  const statsData = useMemo(() => {
    return calculateStats(itemsWithCurrentStatus);
  }, [itemsWithCurrentStatus]);

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <AuthPages onLogin={handleLogin} />;
  }

  // Show loading skeleton while loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show How To Guide page if active
  if (showHowToGuide) {
    return <HowToGuide onBack={() => setShowHowToGuide(false)} />;
  }

  const generateBatchNumber = (name: string) => {
    const prefix = name
      .substring(0, 4)
      .toUpperCase()
      .replace(/[^A-Z]/g, "X");
    const existingBatches = items.filter(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    ).length;
    return `${prefix}-${String(existingBatches + 1).padStart(3, "0")}`;
  };

  const handleStockOutComplete = (result: any) => {
    // Update local state with the updated items
    if (result.updatedItems && result.updatedItems.length > 0) {
      setItems((prev) =>
        prev.map((item) => {
          const updated = result.updatedItems.find((u: InventoryItem) => u.id === item.id);
          return updated || item;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Logo, Title, and Mobile Menu */}
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-background flex items-center justify-center shrink-0">
                <PantryKeeperLogo className="h-8 md:h-12 w-auto" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  PantryKeeper
                </h1>
                <p className="text-gray-600 mt-0.5 text-xs md:text-sm leading-snug">
                  Food Donation Management
                </p>
              </div>
            </div>

            {/* Mobile Menu - Now in same row */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    title="Menu"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {/* User Profile Section */}
                  <div className="px-2 py-1.5 text-sm border-b">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <p className="font-medium text-gray-900">{currentUser?.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 pl-6">{currentUser?.email}</p>
                  </div>
                  
                  <DropdownMenuItem onClick={() => setShowChangePassword(true)}>
                    <KeyRound className="w-4 h-4 mr-2" />
                    Change Password
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => exportActions.handleExport(filteredItems.length > 0 ? filteredItems : itemsWithCurrentStatus)}>
                    <Download className="w-4 h-4 mr-2" />
                    Export to CSV
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={auditLog.openDialog}>
                    <History className="w-4 h-4 mr-2" />
                    Audit Log
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setShowHowToGuide(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    How To Guide
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 border-t">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-11 px-3 gap-2"
                  title="User Profile"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentUser?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                <DropdownMenuItem onClick={() => setShowChangePassword(true)}>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-8 bg-gray-300 mx-1" />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11"
              onClick={() => exportActions.handleExport(filteredItems.length > 0 ? filteredItems : itemsWithCurrentStatus)}
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
            </Button>

            {/* More menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11"
                  title="More options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={auditLog.openDialog}>
                  <History className="w-4 h-4 mr-2" />
                  Audit Log
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowHowToGuide(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  How To Guide
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-8 bg-gray-300 mx-1" />
            <Button
              variant="outline"
              className="h-11 px-6 bg-white text-[#F58220] border-[#F58220] hover:bg-orange-50"
              onClick={stockOut.openDialog}
            >
              <Minus className="w-4 h-4" />
              Stock Out
            </Button>
            <Button
              className="h-11 px-6"
              onClick={inventory.openAddDialog}
            >
              <Plus className="w-4 h-4" />
              Stock In
            </Button>
          </div>

          {/* Mobile Action Buttons */}
          <div className="md:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <Button
              variant="outline"
              className="h-16 w-16 rounded-full shadow-lg p-0 focus-visible:ring-4 focus-visible:ring-offset-2 bg-white text-[#F58220] border-[#F58220] hover:bg-orange-50"
              onClick={stockOut.openDialog}
              aria-label="Stock Out Items"
            >
              <Minus className="w-6 h-6" />
            </Button>
            <Button
              className="h-16 w-16 rounded-full shadow-lg p-0 focus-visible:ring-4 focus-visible:ring-offset-2"
              onClick={inventory.openAddDialog}
              aria-label="Stock In Items"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          {/* Inventory Feature - Extracted to /features/inventory */}
          <InventoryFeature
            hook={inventory}
            items={items}
            generateBatchNumber={generateBatchNumber}
            getItemStatus={getItemStatus}
            onItemCreated={(item) => setItems((prev) => [...prev, item])}
            onItemUpdated={(item) => setItems((prev) => prev.map((i) => i.id === item.id ? item : i))}
            onItemDeleted={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
          />

          {/* Old dialog removed - now using InventoryFeature component */}

          {/* Stocking Feature - Extracted to /features/stocking */}
          <StockingFeature
            hook={stockOut}
            items={itemsWithCurrentStatus}
            onStockOutComplete={handleStockOutComplete}
          />

          {/* Audit Log Feature - Extracted to /features/audit-log */}
          <AuditLogFeature hook={auditLog} />
        </div>

        {/* Stats Cards - Interactive Filters */}
        <StatsCards
          stats={statsData}
          activeFilter={searchFilter.filterStatus}
          onFilterToggle={searchFilter.toggleStatusFilter}
        />

        {/* Filters */}
        <FilterBar
          searchTerm={searchFilter.searchTerm}
          filterStatus={searchFilter.filterStatus}
          onSearchChange={searchFilter.setSearchTerm}
          onFilterChange={searchFilter.setFilterStatus}
          onClearFilters={searchFilter.clearFilters}
          hasActiveFilters={searchFilter.hasActiveFilters}
        />

        {/* Inventory Items - Extracted to /features/inventory-display */}
        <InventoryDisplay
          items={filteredItems}
          hasActiveFilters={searchFilter.hasActiveFilters}
          onClearFilters={searchFilter.clearFilters}
          onEditItem={inventory.openEditDialog}
          onDuplicateItem={inventory.openDuplicateDialog}
          onDeleteItem={inventory.openDeleteDialog}
        />
      </div>

      {/* Delete Confirmation Dialog now in InventoryFeature */}

      <Toaster richColors position="top-right" />

      {/* User Guide Feature - Extracted to /features/user-guide */}
      <UserGuideDialog
        open={userGuideOpen}
        onOpenChange={setUserGuideOpen}
      />

      {/* Footer */}
      <footer className="mt-16 mb-20 md:mb-0 border-t border-gray-200 pt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600">
                © 2026 Better.sg. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Better.sg
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <p
                onClick={() => setShowHowToGuide(true)}
                className="text-gray-600 hover:text-[#F58220] transition-colors cursor-pointer"
              >
                How To Guide
              </p>
              <p className="text-gray-600 hover:text-[#F58220] transition-colors cursor-pointer">
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />
    </div>
  );
}