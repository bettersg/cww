import React, { useState, useMemo, useEffect } from "react";
import {
    Plus,
    Minus,
    Download,
    History,
    User,
    LogOut,
    KeyRound,
    Menu,
    FileText,
    MoreHorizontal
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { PantryKeeperLogo } from "../components/PantryKeeperLogo";
import { api } from "../utils/api";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { HowToGuide } from "../components/HowToGuide";
import { AuditLogFeature, useAuditLog } from "../features/audit-log";
import { StockingFeature, useStockOut } from "../features/stocking";
import { InventoryFeature, useInventory } from "../features/inventory";
import {
    useSearchFilter,
    useFilteredItems,
    FilterBar,
    StatsCards,
} from "../features/search-filter";
import { InventoryDisplay } from "../features/inventory-display";
import { UserGuideDialog } from "../features/user-guide";
import { useExportActions } from "../features/export-actions";
import { getItemStatus, calculateStats } from "../utils/inventoryHelpers";
import { ChangePasswordDialog } from "../components/auth/ChangePasswordDialog";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface InventoryItem {
    id: string;
    name: string;
    description: string;
    quantity: number;
    expiry: string | null;
    status: "fresh" | "expiring" | "expired" | "depleted";
    batchNumber: string;
    receivedDate: string;
    donor?: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
    expiringThreshold: number;
}

export default function DashboardPage() {
    const { user: currentUser, signOut } = useAuth();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userGuideOpen, setUserGuideOpen] = useState(false);
    const [showHowToGuide, setShowHowToGuide] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const navigate = useNavigate();

    // Search & Filter feature
    const searchFilter = useSearchFilter();

    // Audit log feature
    const auditLog = useAuditLog();

    // Stocking feature
    const stockOut = useStockOut();

    // Inventory feature
    const inventory = useInventory();

    // Export actions feature
    const exportActions = useExportActions();

    // Load items from backend on mount
    useEffect(() => {
        const loadItems = async () => {
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
    }, []);

    // Recalculate status dynamically
    const itemsWithCurrentStatus = useMemo(() => {
        return items.map((item) => ({
            ...item,
            status: getItemStatus(item.expiry, item.expiringThreshold, item.quantity),
        }));
    }, [items]);

    // Apply search and filter
    const filteredItems = useFilteredItems({
        items: itemsWithCurrentStatus,
        searchTerm: searchFilter.searchTerm,
        filterStatus: searchFilter.filterStatus,
    });

    // Calculate stats
    const statsData = useMemo(() => {
        return calculateStats(itemsWithCurrentStatus);
    }, [itemsWithCurrentStatus]);


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
        if (result.updatedItems && result.updatedItems.length > 0) {
            setItems((prev) =>
                prev.map((item) => {
                    const updated = result.updatedItems.find((u: InventoryItem) => u.id === item.id);
                    return updated || item;
                })
            );
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/login"); // Optional: ProtectedRoute redirects anyway, but explicit navigation is fine
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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

                    <div className="hidden md:flex items-center gap-2">
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

                    <InventoryFeature
                        hook={inventory}
                        items={items}
                        generateBatchNumber={generateBatchNumber}
                        getItemStatus={getItemStatus}
                        onItemCreated={(item) => setItems((prev) => [...prev, item])}
                        onItemUpdated={(item) => setItems((prev) => prev.map((i) => i.id === item.id ? item : i))}
                        onItemDeleted={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
                    />

                    <StockingFeature
                        hook={stockOut}
                        items={itemsWithCurrentStatus}
                        onStockOutComplete={handleStockOutComplete}
                    />

                    <AuditLogFeature hook={auditLog} />
                </div>

                <StatsCards
                    stats={statsData}
                    activeFilter={searchFilter.filterStatus}
                    onFilterToggle={searchFilter.toggleStatusFilter}
                />

                <FilterBar
                    searchTerm={searchFilter.searchTerm}
                    filterStatus={searchFilter.filterStatus}
                    onSearchChange={searchFilter.setSearchTerm}
                    onFilterChange={searchFilter.setFilterStatus}
                    onClearFilters={searchFilter.clearFilters}
                    hasActiveFilters={searchFilter.hasActiveFilters}
                />

                <InventoryDisplay
                    items={filteredItems}
                    hasActiveFilters={searchFilter.hasActiveFilters}
                    onClearFilters={searchFilter.clearFilters}
                    onEditItem={inventory.openEditDialog}
                    onDuplicateItem={inventory.openDuplicateDialog}
                    onDeleteItem={inventory.openDeleteDialog}
                />
            </div>

            <Toaster richColors position="top-right" />

            <UserGuideDialog
                open={userGuideOpen}
                onOpenChange={setUserGuideOpen}
            />

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

            <ChangePasswordDialog
                open={showChangePassword}
                onOpenChange={setShowChangePassword}
            />
        </div>
    );
}
