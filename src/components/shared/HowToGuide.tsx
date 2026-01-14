import React from "react";
import { ArrowLeft, CheckCircle, AlertCircle, Package, Search } from "lucide-react";
import { Button } from "../ui/button";
import { PantryKeeperLogo } from "./PantryKeeperLogo";

interface HowToGuideProps {
  onBack: () => void;
}

export function HowToGuide({ onBack }: HowToGuideProps) {
  return (
    <div className="min-h-screen bg-[#fffaf5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0"
              title="Back to PantryKeeper"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <PantryKeeperLogo className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-semibold">How To Guide</h1>
                <p className="text-sm text-gray-600">PantryKeeper User Guide</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <article className="prose prose-gray max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to <strong>PantryKeeper</strong>, the food donation inventory management system for Children's Wishing Well charity. This guide will help you effectively track, manage, and distribute donated food items.
            </p>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Getting Started</h2>
            <h3 className="text-xl font-medium mb-3 text-gray-800">Dashboard Overview</h3>
            <p className="text-gray-700 leading-relaxed mb-3">When you open PantryKeeper, you'll see:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Header</strong> - PantryKeeper logo and action buttons</li>
              <li><strong>Stats Cards</strong> - Quick overview of your inventory status</li>
              <li><strong>Search & Filter</strong> - Tools to find specific items</li>
              <li><strong>Inventory List</strong> - Complete list of all food items</li>
            </ol>
          </section>

          {/* Status Indicators */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Understanding Status Indicators</h2>
            <p className="text-gray-700 leading-relaxed mb-4">PantryKeeper automatically categorizes items into different statuses:</p>
            
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Fresh
                </h4>
                <ul className="list-disc list-inside space-y-1 text-green-800 ml-6">
                  <li>Items with plenty of time before expiry</li>
                  <li>Safe to distribute to families</li>
                  <li>Display with green indicators</li>
                </ul>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r">
                <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Expiring Soon
                </h4>
                <ul className="list-disc list-inside space-y-1 text-orange-800 ml-6">
                  <li>Items approaching their expiry date (within your set threshold)</li>
                  <li><strong>Priority for distribution</strong> - distribute these first!</li>
                  <li>Display with orange indicators</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Expired
                </h4>
                <ul className="list-disc list-inside space-y-1 text-red-800 ml-6">
                  <li>Items past their expiry date</li>
                  <li>Should not be distributed</li>
                  <li>Display with red indicators</li>
                </ul>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Depleted
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-6">
                  <li>Items with zero quantity remaining</li>
                  <li>Kept for historical tracking</li>
                  <li>Display with gray indicators and strikethrough text</li>
                  <li>Filter available in dropdown menu</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Adding New Items */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Adding New Items (Stock In)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
              <li>Click the <strong>"Stock In"</strong> button (top right on desktop, floating button on mobile)</li>
              <li className="ml-4">
                Fill in the required fields:
                <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                  <li><strong>Item Name*</strong> - e.g., "Paddy King Brown Rice, 5kg"</li>
                  <li><strong>Description</strong> - Optional details about the item</li>
                  <li><strong>Quantity*</strong> - Number of units received</li>
                  <li><strong>Expiry Date*</strong> - When the item expires (DD/MM/YYYY)</li>
                  <li><strong>Mark as Expiring When*</strong> - Choose threshold (1 week, 1 month, or 6 months before expiry)</li>
                  <li><strong>Donor/Source</strong> - Optional donor information</li>
                  <li><strong>Added By*</strong> - Your name</li>
                </ul>
              </li>
              <li>Click <strong>"Add Item"</strong></li>
            </ol>
            <p className="text-gray-600 mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r">
              <strong>Note:</strong> A unique batch number is automatically generated for tracking.
            </p>
          </section>

          {/* Stock Out */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Removing Stock (Stock Out)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
              <li>Click the <strong>"Stock Out"</strong> button (orange button in header)</li>
              <li>Select items you want to remove from the checklist</li>
              <li>Click <strong>"Confirm Selection"</strong></li>
              <li className="ml-4">
                The system will:
                <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                  <li>Set quantity to 0 for all selected items</li>
                  <li>Mark them as "Depleted"</li>
                  <li>Keep them in inventory for historical tracking</li>
                  <li>Add strikethrough and gray styling</li>
                </ul>
              </li>
            </ol>
            <p className="text-gray-600 mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r">
              <strong>Tip:</strong> Stock Out is perfect for batch distribution when items are fully distributed to families.
            </p>
          </section>

          {/* Searching & Filtering */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Searching & Filtering</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Bar
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li>Type in the search bar to find items by name or description</li>
              <li>Search is instant and case-insensitive</li>
              <li>Works alongside status filters</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Status Filters</h3>
            
            <h4 className="font-medium mb-2 text-gray-700">Quick Filter Cards (Desktop)</h4>
            <p className="text-gray-700 mb-2">Click any of the three stat cards to filter by that status:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li><strong>Fresh</strong> - Green card</li>
              <li><strong>Expiring</strong> - Orange card</li>
              <li><strong>Expired</strong> - Red card</li>
            </ul>
            <p className="text-gray-600 italic mb-6">Click again to show all items.</p>

            <h4 className="font-medium mb-2 text-gray-700">Dropdown Filter (All Devices)</h4>
            <p className="text-gray-700 mb-2">Use the dropdown menu to filter by:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>All Items</li>
              <li>Fresh Only</li>
              <li>Expiring Soon</li>
              <li>Expired Only</li>
              <li><strong>Depleted Only</strong> - View historical depleted batches</li>
            </ul>
          </section>

          {/* Editing Items */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Editing Items</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Click the <strong>three-dot menu</strong> (⋮) next to any item</li>
              <li>Select <strong>"Edit"</strong></li>
              <li>Update the fields you need to change</li>
              <li>Enter your name in <strong>"Modified By"</strong></li>
              <li>Click <strong>"Update Item"</strong></li>
            </ol>
            <p className="text-gray-700 mt-3"><strong>Common edits:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Reducing quantity after distribution</li>
              <li>Updating expiry dates if needed</li>
              <li>Changing expiring threshold</li>
            </ul>
          </section>

          {/* Deleting Items */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Deleting Items</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Click the <strong>three-dot menu</strong> (⋮) next to the item</li>
              <li>Select <strong>"Delete"</strong></li>
              <li>Confirm deletion in the dialog</li>
              <li>The item will be permanently removed</li>
            </ol>
            <p className="text-red-600 mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded-r">
              <strong>Warning:</strong> Deletion cannot be undone. Consider using Stock Out or reducing quantity to 0 instead to maintain historical records.
            </p>
          </section>

          {/* Batch Numbers */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Understanding Batch Numbers</h2>
            <p className="text-gray-700 mb-3">Each item receives a unique batch number when added:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Format:</strong> <code className="bg-gray-100 px-2 py-1 rounded">XXXX-###</code></li>
              <li><strong>Example:</strong> <code className="bg-gray-100 px-2 py-1 rounded">PADD-001</code>, <code className="bg-gray-100 px-2 py-1 rounded">FAIR-002</code></li>
            </ul>
            
            <p className="text-gray-700 mt-4 mb-2"><strong>Benefits:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>Track different shipments of the same item</li>
              <li>Maintain traceability for food safety</li>
              <li>Identify which donation batches were distributed</li>
            </ul>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-4">
              <p className="text-gray-700 font-medium mb-2">Example:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li><code className="bg-white px-2 py-1 rounded">FAIR-001</code> - First batch of FairPrice Vermicelli (4 units, expires 10/04/2026)</li>
                <li><code className="bg-white px-2 py-1 rounded">FAIR-002</code> - Second batch of FairPrice Vermicelli (depleted, expired 15/03/2026)</li>
              </ul>
            </div>
          </section>

          {/* Smart Quantity Management */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Smart Quantity Management</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Setting Quantity to Zero</h3>
            <p className="text-gray-700 mb-2">When you distribute all units of an item:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-3">
              <li>Edit the item (or use Stock Out)</li>
              <li>Set <strong>Quantity</strong> to <code className="bg-gray-100 px-2 py-1 rounded">0</code></li>
              <li>The item automatically becomes <strong>"Depleted"</strong></li>
              <li className="ml-4">
                Item remains in inventory with:
                <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                  <li>Strikethrough text</li>
                  <li>Gray "Depleted" badge</li>
                  <li>Reduced opacity</li>
                  <li>Available in "Depleted Only" filter</li>
                </ul>
              </li>
            </ol>

            <h3 className="text-xl font-medium mb-3 text-gray-800 mt-6">Why Keep Depleted Items?</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Historical tracking</strong> - Know what was distributed</li>
              <li><strong>Donation reports</strong> - Calculate total items donated to families</li>
              <li><strong>Trend analysis</strong> - Understand popular items</li>
              <li><strong>Accountability</strong> - Maintain complete records</li>
            </ul>
          </section>

          {/* Distribution Best Practices */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Distribution Best Practices</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Priority System</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li><strong>First:</strong> Items marked "Expiring Soon" (orange)</li>
              <li><strong>Second:</strong> Oldest "Fresh" items</li>
              <li><strong>Avoid:</strong> Expired items (red)</li>
            </ol>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Before Distribution</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li>Check the <strong>Expiring</strong> filter to see priority items</li>
              <li>Verify expiry dates (shown in DD/MM/YYYY format)</li>
              <li>Note batch numbers for tracking</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">After Distribution</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Use Stock Out for fully distributed items, OR</li>
              <li>Edit the item to reduce quantity by amount distributed</li>
              <li>If fully distributed, set quantity to 0</li>
              <li>Enter your name in "Modified By"</li>
            </ol>
          </section>

          {/* Mobile vs Desktop */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Mobile vs Desktop</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <h3 className="text-lg font-medium mb-3 text-blue-900">Desktop Features</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 ml-2">
                  <li>Full table view with all details</li>
                  <li>Click stat cards for quick filtering</li>
                  <li>Easier for bulk review</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <h3 className="text-lg font-medium mb-3 text-purple-900">Mobile Features</h3>
                <ul className="list-disc list-inside space-y-1 text-purple-800 ml-2">
                  <li>Card-based layout optimized for touch</li>
                  <li>Floating action button for adding items</li>
                  <li>Dropdown filter menu</li>
                  <li>Swipe-friendly interface</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tips & Best Practices */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Tips & Best Practices</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
              <li><strong>Regular Reviews</strong> - Check your inventory daily for expiring items</li>
              <li><strong>Accurate Dates</strong> - Always verify expiry dates when receiving donations</li>
              <li className="ml-4">
                <strong>Set Thresholds Wisely:</strong>
                <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                  <li>1 week for perishables</li>
                  <li>1 month for canned goods</li>
                  <li>6 months for long-shelf-life items</li>
                </ul>
              </li>
              <li><strong>Document Everything</strong> - Always enter your name when making changes</li>
              <li><strong>Don't Delete</strong> - Use Stock Out or set quantity to 0 instead to maintain records</li>
              <li><strong>Prioritize Distribution</strong> - Focus on orange "Expiring" items first</li>
            </ol>
          </section>

          {/* Common Questions */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Common Questions</h2>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Q: What happens when an item expires?</p>
                <p className="text-gray-700 ml-4">A: The status automatically changes to "Expired" (red) based on today's date. The item should not be distributed.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Q: Can I change the expiring threshold after adding an item?</p>
                <p className="text-gray-700 ml-4">A: Yes! Edit the item and select a new threshold in "Mark as Expiring When".</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Q: Why do I see multiple batches of the same item?</p>
                <p className="text-gray-700 ml-4">A: Different donations of the same item are tracked separately with unique batch numbers for traceability.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Q: How do I see only items ready to distribute?</p>
                <p className="text-gray-700 ml-4">A: Click the "Fresh" filter card or select "Fresh Only" from the dropdown.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Q: Can I recover a deleted item?</p>
                <p className="text-gray-700 ml-4">A: No, deletions are permanent. Consider using Stock Out or setting quantity to 0 instead.</p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Support</h2>
            <p className="text-gray-700 mb-2">For technical issues or questions:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Check the <a href="https://github.com/ReubenChan96/cww-food-inventory/wiki" target="_blank" rel="noopener noreferrer" className="text-[#F58220] hover:underline">GitHub Documentation</a></li>
              <li>Contact your PantryKeeper administrator</li>
            </ul>
          </section>

          {/* Footer Info */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p><strong>Last Updated:</strong> January 3, 2026</p>
            <p><strong>Version:</strong> 2.0</p>
          </div>
        </article>

        {/* Back to Top Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={onBack}
            className="bg-[#F58220] hover:bg-[#E67517]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to PantryKeeper
          </Button>
        </div>
      </main>
    </div>
  );
}
