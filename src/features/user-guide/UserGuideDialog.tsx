import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { ScrollArea } from "../../components/ui/scroll-area";

interface UserGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserGuideDialog({ open, onOpenChange }: UserGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl">PantryKeeper User Guide</DialogTitle>
          <DialogDescription>
            Complete guide to using PantryKeeper for food donation management
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(85vh-120px)]">
          <div className="px-6 py-4 space-y-8 text-sm max-w-full overflow-hidden">
            
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to <strong>PantryKeeper</strong>, the food donation inventory management system for Children's Wishing Well charity. This guide will help you effectively track, manage, and distribute donated food items.
              </p>
            </section>

            {/* Getting Started */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
              <h3 className="font-semibold mb-2">Dashboard Overview</h3>
              <p className="text-gray-700 leading-relaxed mb-3">When you open PantryKeeper, you'll see:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2">
                <li><strong>Header</strong> - PantryKeeper logo and "Stock In" button</li>
                <li><strong>Stats Cards</strong> - Quick overview of your inventory status</li>
                <li><strong>Search & Filter</strong> - Tools to find specific items</li>
                <li><strong>Inventory Table</strong> - Complete list of all food items</li>
              </ol>
            </section>

            {/* Understanding Status Indicators */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Understanding Status Indicators</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                PantryKeeper automatically categorizes items into three main statuses:
              </p>
              <div className="space-y-3 max-w-full">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 break-words">
                  <h4 className="font-semibold text-green-700 mb-1">🟢 Fresh</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 text-sm break-words">
                    <li>Items with plenty of time before expiry</li>
                    <li>Safe to distribute to families</li>
                    <li>Display with green indicators</li>
                  </ul>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 break-words">
                  <h4 className="font-semibold text-orange-700 mb-1">🟠 Expiring Soon</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 text-sm break-words">
                    <li>Items approaching their expiry date (within your set threshold)</li>
                    <li><strong>Priority for distribution</strong> - distribute these first!</li>
                    <li>Display with orange indicators</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 break-words">
                  <h4 className="font-semibold text-red-700 mb-1">🔴 Expired</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 text-sm break-words">
                    <li>Items past their expiry date</li>
                    <li>Should not be distributed</li>
                    <li>Display with red indicators</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 break-words">
                  <h4 className="font-semibold text-gray-700 mb-1">📦 Depleted</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 text-sm break-words">
                    <li>Items with zero quantity remaining</li>
                    <li>Kept for historical tracking</li>
                    <li>Display with gray indicators and strikethrough text</li>
                    <li>Filter available in dropdown menu</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Adding New Items */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Adding New Items</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
                <li>Click the <strong>"Stock In"</strong> button (top right on desktop, floating button on mobile)</li>
                <li>Fill in the required fields:
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                    <li><strong>Item Name*</strong> - e.g., "Paddy King Brown Rice, 5kg"</li>
                    <li><strong>Description</strong> - Optional details about the item</li>
                    <li><strong>Quantity*</strong> - Number of units received</li>
                    <li><strong>Expiry Date*</strong> - When the item expires</li>
                    <li><strong>Mark as Expiring When*</strong> - Choose threshold (1 week, 1 month, or 6 months)</li>
                    <li><strong>Donor/Source</strong> - Optional donor information</li>
                    <li><strong>Added By*</strong> - Your name</li>
                  </ul>
                </li>
                <li>Click <strong>"Add Item"</strong></li>
              </ol>
              <p className="text-gray-600 text-sm mt-2 italic">
                <strong>Note:</strong> A unique batch number is automatically generated for tracking.
              </p>
            </section>

            {/* Searching & Filtering */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Searching & Filtering</h2>
              <h3 className="font-semibold mb-2">Search Bar</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-4">
                <li>Type in the search bar to find items by name or description</li>
                <li>Search is instant and case-insensitive</li>
                <li>Works alongside status filters</li>
              </ul>
              
              <h3 className="font-semibold mb-2">Status Filters</h3>
              <h4 className="font-medium text-sm mb-1">Quick Filter Cards (Desktop)</h4>
              <p className="text-gray-700 mb-2">Click any of the three stat cards to filter by that status:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-3">
                <li><strong>Fresh</strong> - Green card</li>
                <li><strong>Expiring</strong> - Orange card</li>
                <li><strong>Expired</strong> - Red card</li>
              </ul>
              <p className="text-gray-700 mb-3">Click again to show all items.</p>
              
              <h4 className="font-medium text-sm mb-1">Dropdown Filter (All Devices)</h4>
              <p className="text-gray-700 mb-2">Use the dropdown menu to filter by:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>All Items</li>
                <li>Fresh Only</li>
                <li>Expiring Soon</li>
                <li>Expired Only</li>
                <li><strong>Depleted Only</strong> - View historical depleted batches</li>
              </ul>
            </section>

            {/* Editing Items */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Editing Items</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
                <li>Click the <strong>three-dot menu</strong> (⋮) next to any item</li>
                <li>Select <strong>"Edit"</strong></li>
                <li>Update the fields you need to change</li>
                <li>Enter your name in <strong>"Modified By"</strong></li>
                <li>Click <strong>"Update Item"</strong></li>
              </ol>
              <p className="text-gray-700 mt-3 mb-2"><strong>Common edits:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Reducing quantity after distribution</li>
                <li>Updating expiry dates if needed</li>
                <li>Changing expiring threshold</li>
              </ul>
            </section>

            {/* Stock Out Items */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Stock Out Items (Batch Operation)</h2>
              <p className="text-gray-700 mb-3">
                The Stock Out feature allows you to quickly remove multiple items from inventory in a single operation. This is ideal when distributing items or removing stock from the system.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
                <li>Click the <strong>"Stock Out"</strong> button (top right on desktop, floating button on mobile)</li>
                <li>Enter your name in the <strong>"Your Name"</strong> field</li>
                <li>Use the <strong>search bar</strong> to quickly find specific items (optional)</li>
                <li>Select items to stock out by clicking the checkbox next to each item</li>
                <li>For each selected item, use the <strong>+ and - buttons</strong> to adjust quantity</li>
                <li>Review your selections in the summary at the bottom</li>
                <li>Click <strong>"Confirm Selection"</strong> to review, then <strong>"Stock Out"</strong> to finalize</li>
              </ol>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3 break-words max-w-full">
                <p className="text-orange-800 text-sm mb-2 break-words"><strong>Benefits of Stock Out:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm ml-2 break-words">
                  <li>Process multiple items at once</li>
                  <li>Search functionality to quickly find items</li>
                  <li>Selected items grouped at top for easy tracking</li>
                  <li>Mobile-friendly +/- buttons for quantity adjustment</li>
                  <li>Automatic validation - prevents stocking out more than available</li>
                  <li>Clear visual feedback with error messages</li>
                  <li>Maintains audit trail with your name and timestamp</li>
                  <li>Items with zero quantity automatically become "Depleted"</li>
                </ul>
              </div>
            </section>

            {/* Deleting Items */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Deleting Items</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
                <li>Click the <strong>three-dot menu</strong> (⋮) next to the item</li>
                <li>Select <strong>"Delete"</strong></li>
                <li>Confirm deletion in the dialog</li>
                <li>The item will be permanently removed</li>
              </ol>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3 break-words max-w-full">
                <p className="text-yellow-800 text-sm break-words">
                  <strong>⚠️ Warning:</strong> Deletion cannot be undone. Consider reducing quantity to 0 instead to maintain historical records.
                </p>
              </div>
            </section>

            {/* Understanding Batch Numbers */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Understanding Batch Numbers</h2>
              <p className="text-gray-700 mb-3">Each item receives a unique batch number when added:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-3">
                <li><strong>Format:</strong> XXXX-###</li>
                <li><strong>Example:</strong> PADD-001, FAIR-002</li>
              </ul>
              <p className="text-gray-700 mb-2"><strong>Benefits:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-3">
                <li>Track different shipments of the same item</li>
                <li>Maintain traceability for food safety</li>
                <li>Identify which donation batches were distributed</li>
              </ul>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 break-words max-w-full">
                <p className="text-orange-800 text-sm mb-2 break-words"><strong>Example:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm ml-2 break-words">
                  <li>FAIR-001 - First batch of FairPrice Vermicelli (4 units, expires 10/04/2026)</li>
                  <li>FAIR-002 - Second batch of FairPrice Vermicelli (depleted, expired 15/03/2026)</li>
                </ul>
              </div>
            </section>

            {/* Smart Quantity Management */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Smart Quantity Management</h2>
              <h3 className="font-semibold mb-2">Setting Quantity to Zero</h3>
              <p className="text-gray-700 mb-2">When you distribute all units of an item:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2 mb-3">
                <li>Edit the item</li>
                <li>Set <strong>Quantity</strong> to <code className="bg-gray-100 px-1 py-0.5 rounded">0</code></li>
                <li>The item automatically becomes <strong>"Depleted"</strong></li>
                <li>Item remains in inventory with:
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                    <li>Strikethrough text</li>
                    <li>Gray "Depleted" badge</li>
                    <li>Reduced opacity</li>
                    <li>Available in "Depleted Only" filter</li>
                  </ul>
                </li>
              </ol>
              
              <h3 className="font-semibold mb-2">Why Keep Depleted Items?</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li><strong>Historical tracking</strong> - Know what was distributed</li>
                <li><strong>Donation reports</strong> - Calculate total items donated to families</li>
                <li><strong>Trend analysis</strong> - Understand popular items</li>
                <li><strong>Accountability</strong> - Maintain complete records</li>
              </ul>
            </section>

            {/* Distribution Best Practices */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Distribution Best Practices</h2>
              <h3 className="font-semibold mb-2">Priority System</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2 mb-4">
                <li><strong>First:</strong> Items marked "Expiring Soon" (orange)</li>
                <li><strong>Second:</strong> Oldest "Fresh" items</li>
                <li><strong>Avoid:</strong> Expired items (red)</li>
              </ol>
              
              <h3 className="font-semibold mb-2">Before Distribution</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-4">
                <li>Check the <strong>Expiring</strong> filter to see priority items</li>
                <li>Verify expiry dates (shown in DD/MM/YYYY format)</li>
                <li>Note batch numbers for tracking</li>
              </ul>
              
              <h3 className="font-semibold mb-2">After Distribution</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2">
                <li>Edit the item</li>
                <li>Reduce quantity by amount distributed</li>
                <li>If fully distributed, set quantity to 0</li>
                <li>Enter your name in "Modified By"</li>
              </ol>
            </section>

            {/* Mobile vs Desktop */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Mobile vs Desktop</h2>
              <div className="grid md:grid-cols-2 gap-4 max-w-full">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 break-words">
                  <h4 className="font-semibold mb-2">Desktop Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 text-sm break-words">
                    <li>Full table view with all details</li>
                    <li>Click stat cards for quick filtering</li>
                    <li>Easier for bulk review</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 break-words">
                  <h4 className="font-semibold mb-2">Mobile Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 text-sm break-words">
                    <li>Card-based layout optimized for touch</li>
                    <li>Floating action buttons for adding items and stock out</li>
                    <li>Dropdown filter menu</li>
                    <li>Swipe-friendly interface</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Tips & Best Practices */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Tips & Best Practices</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
                <li><strong>Regular Reviews</strong> - Check your inventory daily for expiring items</li>
                <li><strong>Accurate Dates</strong> - Always verify expiry dates when receiving donations</li>
                <li><strong>Set Thresholds Wisely:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                    <li>1 week for perishables</li>
                    <li>1 month for canned goods</li>
                    <li>6 months for long-shelf-life items</li>
                  </ul>
                </li>
                <li><strong>Document Everything</strong> - Always enter your name when making changes</li>
                <li><strong>Don't Delete</strong> - Set quantity to 0 instead to maintain records</li>
                <li><strong>Prioritize Distribution</strong> - Focus on orange "Expiring" items first</li>
              </ol>
            </section>

            {/* Common Questions */}
            <section className="pb-4">
              <h2 className="text-xl font-semibold mb-3">Common Questions</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">Q: What happens when an item expires?</p>
                  <p className="text-gray-700 text-sm ml-4">A: The status automatically changes to "Expired" (red) based on today's date. The item should not be distributed.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Q: Can I change the expiring threshold after adding an item?</p>
                  <p className="text-gray-700 text-sm ml-4">A: Yes! Edit the item and select a new threshold in "Mark as Expiring When".</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Q: Why do I see multiple batches of the same item?</p>
                  <p className="text-gray-700 text-sm ml-4">A: Different donations of the same item are tracked separately with unique batch numbers for traceability.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Q: How do I see only items ready to distribute?</p>
                  <p className="text-gray-700 text-sm ml-4">A: Click the "Fresh" filter card or select "Fresh Only" from the dropdown.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Q: Can I recover a deleted item?</p>
                  <p className="text-gray-700 text-sm ml-4">A: No, deletions are permanent. Consider setting quantity to 0 instead.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Q: What's the difference between Stock Out and editing item quantity?</p>
                  <p className="text-gray-700 text-sm ml-4">A: Stock Out allows you to process multiple items at once, making it faster for bulk operations. It also provides validation and clearer feedback. For single items, you can use either method.</p>
                </div>
              </div>
            </section>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
