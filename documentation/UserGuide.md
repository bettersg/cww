# PantryKeeper User Guide

## Introduction

Welcome to **PantryKeeper**, the food donation inventory management system for Children's Wishing Well charity. This guide will help you effectively track, manage, and distribute donated food items.

---

## Getting Started

### Dashboard Overview

When you open PantryKeeper, you'll see:

1. **Header** - PantryKeeper logo and "Add New Item" button
2. **Stats Cards** - Quick overview of your inventory status
3. **Search & Filter** - Tools to find specific items
4. **Inventory Table** - Complete list of all food items

---

## Understanding Status Indicators

PantryKeeper automatically categorizes items into three main statuses:

### 🟢 Fresh
- Items with plenty of time before expiry
- Safe to distribute to families
- Display with green indicators

### 🟠 Expiring Soon
- Items approaching their expiry date (within your set threshold)
- **Priority for distribution** - distribute these first!
- Display with orange indicators

### 🔴 Expired
- Items past their expiry date
- Should not be distributed
- Display with red indicators

### 📦 Depleted
- Items with zero quantity remaining
- Kept for historical tracking
- Display with gray indicators and strikethrough text
- Filter available in dropdown menu

---

## Adding New Items

1. Click the **"Add New Item"** button (top right on desktop, floating button on mobile)
2. Fill in the required fields:
   - **Item Name*** - e.g., "Paddy King Brown Rice, 5kg"
   - **Description** - Optional details about the item
   - **Quantity*** - Number of units received
   - **Expiry Date*** - When the item expires
   - **Mark as Expiring When*** - Choose threshold (1 week, 1 month, or 6 months before expiry)
   - **Donor/Source** - Optional donor information
   - **Added By*** - Your name
3. Click **"Add Item"**

**Note:** A unique batch number is automatically generated for tracking.

---

## Searching & Filtering

### Search Bar
- Type in the search bar to find items by name or description
- Search is instant and case-insensitive
- Works alongside status filters

### Status Filters

#### Quick Filter Cards (Desktop)
Click any of the three stat cards to filter by that status:
- **Fresh** - Green card
- **Expiring** - Orange card  
- **Expired** - Red card

Click again to show all items.

#### Dropdown Filter (All Devices)
Use the dropdown menu to filter by:
- All Items - All items of Fresh/Expiring Soon/Expired (Except Depleted)
- Fresh Only
- Expiring Soon
- Expired Only
- **Depleted Only** - View historical depleted batches

---

## Editing Items

1. Click the **three-dot menu** (⋮) next to any item
2. Select **"Edit"**
3. Update the fields you need to change
4. Enter your name in **"Modified By"**
5. Click **"Update Item"**

**Common edits:**
- Reducing quantity after distribution
- Updating expiry dates if needed
- Changing expiring threshold

---

## Deleting Items

1. Click the **three-dot menu** (⋮) next to the item
2. Select **"Delete"**
3. Confirm deletion in the dialog
4. The item will be permanently removed

**Warning:** Deletion cannot be undone. Consider reducing quantity to 0 instead to maintain historical records.

---

## Understanding Batch Numbers

Each item receives a unique batch number when added:
- **Format:** `XXXX-###`
- **Example:** `PADD-001`, `FAIR-002`

**Benefits:**
- Track different shipments of the same item
- Maintain traceability for food safety
- Identify which donation batches were distributed

**Example:**
- `FAIR-001` - First batch of FairPrice Vermicelli (4 units, expires 10/04/2026)
- `FAIR-002` - Second batch of FairPrice Vermicelli (depleted, expired 15/03/2026)

---

## Smart Quantity Management

### Setting Quantity to Zero
When you distribute all units of an item:
1. Edit the item
2. Set **Quantity** to `0`
3. The item automatically becomes **"Depleted"**
4. Item remains in inventory with:
   - Strikethrough text
   - Gray "Depleted" badge
   - Reduced opacity
   - Available in "Depleted Only" filter

### Why Keep Depleted Items?
- **Historical tracking** - Know what was distributed
- **Donation reports** - Calculate total items donated to families
- **Trend analysis** - Understand popular items
- **Accountability** - Maintain complete records

---

## Distribution Best Practices

### Priority System
1. **First:** Items marked "Expiring Soon" (orange)
2. **Second:** Oldest "Fresh" items
3. **Avoid:** Expired items (red)

### Before Distribution
- Check the **Expiring** filter to see priority items
- Verify expiry dates (shown in DD/MM/YYYY format)
- Note batch numbers for tracking

### After Distribution
1. Edit the item
2. Reduce quantity by amount distributed
3. If fully distributed, set quantity to 0
4. Enter your name in "Modified By"

---

## Mobile vs Desktop

### Desktop Features
- Full table view with all details
- Click stat cards for quick filtering
- Easier for bulk review

### Mobile Features
- Card-based layout optimized for touch
- Floating action button for adding items
- Dropdown filter menu
- Swipe-friendly interface

---

## Tips & Best Practices

1. **Regular Reviews** - Check your inventory daily for expiring items
2. **Accurate Dates** - Always verify expiry dates when receiving donations
3. **Set Thresholds Wisely:**
   - 1 week for perishables
   - 1 month for canned goods
   - 6 months for long-shelf-life items
4. **Document Everything** - Always enter your name when making changes
5. **Don't Delete** - Set quantity to 0 instead to maintain records
6. **Prioritize Distribution** - Focus on orange "Expiring" items first

---

## Common Questions

**Q: What happens when an item expires?**  
A: The status automatically changes to "Expired" (red) based on today's date. The item should not be distributed.

**Q: Can I change the expiring threshold after adding an item?**  
A: Yes! Edit the item and select a new threshold in "Mark as Expiring When".

**Q: Why do I see multiple batches of the same item?**  
A: Different donations of the same item are tracked separately with unique batch numbers for traceability.

**Q: How do I see only items ready to distribute?**  
A: Click the "Fresh" filter card or select "Fresh Only" from the dropdown.

**Q: Can I recover a deleted item?**  
A: No, deletions are permanent. Consider setting quantity to 0 instead.

---

## Support

For technical issues or questions:
- Check the [GitHub Documentation](https://github.com/ReubenChan96/cww-food-inventory/wiki)
- Contact your PantryKeeper administrator

---

**Last Updated:** October 31, 2025  
**Version:** 1.0
