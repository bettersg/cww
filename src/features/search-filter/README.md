# Search & Filter Feature

A modular feature that handles all search and filtering functionality for the PantryKeeper inventory system.

## Overview

This feature provides a complete search and filter system for inventory items, including:
- Text-based search across item properties
- Status-based filtering (fresh, expiring, expired, depleted, all)
- Interactive stats cards that act as quick filters
- Filter bar with search input, dropdown, and clear button
- Responsive design for mobile and desktop

## Architecture

```
/features/search-filter/
├── types.ts                    # TypeScript type definitions
├── hooks/
│   ├── useSearchFilter.ts      # Main hook for search/filter state
│   ├── useFilteredItems.ts     # Hook for applying filters to items
│   └── index.ts                # Hook exports
├── components/
│   ├── SearchBar.tsx           # Search input component
│   ├── FilterDropdown.tsx      # Status filter dropdown
│   ├── ClearFiltersButton.tsx  # Clear filters button
│   ├── FilterBar.tsx           # Complete filter controls
│   ├── StatsCard.tsx           # Individual stat card
│   ├── StatsCards.tsx          # Grid of stats cards
│   └── index.ts                # Component exports
└── index.ts                    # Main feature export
```

## Usage

### Basic Integration

```tsx
import { 
  useSearchFilter, 
  useFilteredItems, 
  FilterBar, 
  StatsCards 
} from "./features/search-filter";

function App() {
  const [items, setItems] = useState([]);
  const searchFilter = useSearchFilter();
  
  const filteredItems = useFilteredItems({
    items: itemsWithCurrentStatus,
    searchTerm: searchFilter.searchTerm,
    filterStatus: searchFilter.filterStatus,
  });

  const statsData = {
    fresh: items.filter(i => i.status === "fresh").length,
    expiring: items.filter(i => i.status === "expiring").length,
    expired: items.filter(i => i.status === "expired").length,
    depleted: items.filter(i => i.status === "depleted").length,
  };

  return (
    <div>
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
      
      {/* Display filtered items */}
      {filteredItems.map(item => ...)}
    </div>
  );
}
```

## Hooks

### `useSearchFilter()`

Main hook for managing search and filter state.

**Returns:**
- `searchTerm: string` - Current search term
- `filterStatus: FilterStatus` - Current filter status ("all" | "fresh" | "expiring" | "expired" | "depleted")
- `setSearchTerm: (term: string) => void` - Update search term
- `setFilterStatus: (status: FilterStatus) => void` - Update filter status
- `clearFilters: () => void` - Clear both search and filter
- `toggleStatusFilter: (status) => void` - Toggle a status filter on/off
- `hasActiveFilters: boolean` - True if any filter is active

### `useFilteredItems({ items, searchTerm, filterStatus })`

Applies search and filter criteria to an array of items.

**Parameters:**
- `items: InventoryItem[]` - Array of inventory items
- `searchTerm: string` - Search term to apply
- `filterStatus: FilterStatus` - Status filter to apply

**Returns:**
- `InventoryItem[]` - Filtered array of items

**Search Behavior:**
- Searches across: name, description, batchNumber, donor
- Case-insensitive
- Real-time filtering

## Components

### `<StatsCards>`

Interactive grid of stats cards that act as quick filters.

**Props:**
- `stats: { fresh, expiring, expired, depleted }` - Item counts
- `activeFilter: FilterStatus` - Currently active filter
- `onFilterToggle: (status) => void` - Handler for filter toggle

**Features:**
- Visual feedback for active filter
- Click to toggle filter on/off
- Responsive grid layout

### `<FilterBar>`

Complete filter controls including search, dropdown, and clear button.

**Props:**
- `searchTerm: string` - Current search term
- `filterStatus: FilterStatus` - Current filter status
- `onSearchChange: (term) => void` - Search change handler
- `onFilterChange: (status) => void` - Filter change handler
- `onClearFilters: () => void` - Clear filters handler
- `hasActiveFilters: boolean` - Whether to show clear button

### Individual Components

- `<SearchBar>` - Search input with icon
- `<FilterDropdown>` - Status filter dropdown
- `<ClearFiltersButton>` - Clear filters button
- `<StatsCard>` - Individual interactive stat card

## Type Definitions

```typescript
type FilterStatus = "all" | "fresh" | "expiring" | "expired" | "depleted";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  expiry: string | null;
  status: "fresh" | "expiring" | "expired" | "depleted";
  batchNumber: string;
  donor?: string;
}
```

## Features

### Search Functionality
- Real-time filtering as user types
- Searches across multiple fields
- Case-insensitive matching
- Empty search shows all items

### Filter Functionality
- Status-based filtering
- "All" option to show everything
- Visual indicators for active filters
- Quick toggle via stats cards
- Dropdown for all options

### User Experience
- Toast notification on filter clear
- Visual feedback for active state
- Responsive mobile design
- Accessible ARIA labels
- Keyboard navigation support

## Integration Notes

1. **State Management**: Uses React hooks for local state management
2. **Performance**: Memoized filtering for optimal performance
3. **Accessibility**: Proper ARIA labels and keyboard support
4. **Responsive**: Mobile-first design with desktop enhancements
5. **Type Safety**: Full TypeScript support

## Maintenance

When updating this feature:
1. Update types in `types.ts` if adding new filter options
2. Update both hooks if changing filter logic
3. Ensure components stay in sync with hook API
4. Test filter combinations for edge cases
5. Verify mobile and desktop responsiveness
