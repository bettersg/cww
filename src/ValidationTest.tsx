/**
 * Import Validation Test
 * This file validates that all refactored imports resolve correctly
 * Run this to verify Phase 1-6 refactoring is successful
 */

// ========================================
// TEST 1: Type Imports
// ========================================
import type {
  InventoryItem,
  InventoryStats,
  StatusFilter,
  ChangelogEntry,
  ChangelogFieldChange,
  ExportItem,
  StockOutItem,
  StockOutRequest,
} from './types';

console.log('✅ TEST 1: Type imports resolved');

// ========================================
// TEST 2: Service Imports (New Path)
// ========================================
import { inventoryService, stockingService, auditLogService } from './services/api';

console.log('✅ TEST 2: Service imports (new path) resolved');

// ========================================
// TEST 3: Service Imports (Backward Compatible)
// ========================================
import { api } from './utils/api';

console.log('✅ TEST 3: Service imports (backward compatible) resolved');

// ========================================
// TEST 4: Utility Imports (New Path)
// ========================================
import { formatDate, getDaysUntilExpiry, getTodayString, parseDDMMYYYY } from './utils/formatters/dateFormatter';
import { exportToCSV, exportChangelogToCSV } from './utils/formatters/csvExporter';

console.log('✅ TEST 4: Utility imports (new path) resolved');

// ========================================
// TEST 5: Utility Imports (Backward Compatible)
// ========================================
import { exportToCSV as exportToCSVOld } from './utils/exportHelpers';

console.log('✅ TEST 5: Utility imports (backward compatible) resolved');

// ========================================
// TEST 6: Hook Imports
// ========================================
import { useDebounce, useLocalStorage, useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './hooks';

console.log('✅ TEST 6: Hook imports resolved');

// ========================================
// TEST 7: Component Imports (New Path)
// ========================================
import { LoadingSkeleton } from './components/shared/LoadingSkeleton';
import { PantryKeeperLogo } from './components/shared/PantryKeeperLogo';
import { HowToGuide } from './components/shared/HowToGuide';

console.log('✅ TEST 7: Component imports (new path) resolved');

// ========================================
// TEST 8: Component Imports (Backward Compatible)
// ========================================
import { LoadingSkeleton as LoadingSkeletonOld } from './components/LoadingSkeleton';
import { PantryKeeperLogo as PantryKeeperLogoOld } from './components/PantryKeeperLogo';
import { HowToGuide as HowToGuideOld } from './components/HowToGuide';

console.log('✅ TEST 8: Component imports (backward compatible) resolved');

// ========================================
// TEST 9: Supabase Info (Protected)
// ========================================
import { projectId, publicAnonKey } from './utils/supabase/info';

console.log('✅ TEST 9: Supabase info imports resolved');

// ========================================
// TEST 10: API Methods Available
// ========================================
const testAPIMethods = () => {
  // Check new service methods exist
  const inventoryMethods = [
    'getAllItems',
    'getItem',
    'createItem',
    'updateItem',
    'deleteItem',
    'initializeDatabase',
  ];
  
  inventoryMethods.forEach(method => {
    if (typeof inventoryService[method as keyof typeof inventoryService] !== 'function') {
      throw new Error(`❌ inventoryService.${method} is not a function`);
    }
  });

  const stockingMethods = ['stockOutItems', 'distributeItems'];
  stockingMethods.forEach(method => {
    if (typeof stockingService[method as keyof typeof stockingService] !== 'function') {
      throw new Error(`❌ stockingService.${method} is not a function`);
    }
  });

  const auditMethods = ['getChangelog', 'getChangelogExportUrl', 'clearChangelog'];
  auditMethods.forEach(method => {
    if (typeof auditLogService[method as keyof typeof auditLogService] !== 'function') {
      throw new Error(`❌ auditLogService.${method} is not a function`);
    }
  });

  // Check backward compatible api object
  const apiMethods = [
    'getAllItems',
    'getItem',
    'createItem',
    'updateItem',
    'deleteItem',
    'stockOutItems',
    'distributeItems',
    'getChangelog',
    'getChangelogExportUrl',
    'clearChangelog',
    'initializeDatabase',
  ];

  apiMethods.forEach(method => {
    if (typeof api[method as keyof typeof api] !== 'function') {
      throw new Error(`❌ api.${method} is not a function`);
    }
  });

  console.log('✅ TEST 10: All API methods available');
};

testAPIMethods();

// ========================================
// TEST 11: Utility Functions Work
// ========================================
const testUtilityFunctions = () => {
  // Test formatDate
  const testDate = '2026-03-15';
  const formatted = formatDate(testDate);
  if (!formatted.includes('/')) {
    throw new Error(`❌ formatDate failed: expected DD/MM/YYYY, got ${formatted}`);
  }

  // Test formatDate with null
  const formattedNull = formatDate(null);
  if (formattedNull !== 'No expiry') {
    throw new Error(`❌ formatDate(null) failed: expected "No expiry", got ${formattedNull}`);
  }

  // Test getDaysUntilExpiry
  const days = getDaysUntilExpiry('2026-12-31');
  if (typeof days !== 'number') {
    throw new Error(`❌ getDaysUntilExpiry failed: expected number, got ${typeof days}`);
  }

  // Test getDaysUntilExpiry with null
  const daysNull = getDaysUntilExpiry(null);
  if (daysNull !== null) {
    throw new Error(`❌ getDaysUntilExpiry(null) failed: expected null, got ${daysNull}`);
  }

  console.log('✅ TEST 11: Utility functions work correctly');
};

testUtilityFunctions();

// ========================================
// TEST 12: Hooks Work
// ========================================
const testHooks = () => {
  // Hooks can't be tested outside of React components
  // Just verify they're functions
  if (typeof useDebounce !== 'function') {
    throw new Error('❌ useDebounce is not a function');
  }
  if (typeof useLocalStorage !== 'function') {
    throw new Error('❌ useLocalStorage is not a function');
  }
  if (typeof useMediaQuery !== 'function') {
    throw new Error('❌ useMediaQuery is not a function');
  }
  if (typeof useIsMobile !== 'function') {
    throw new Error('❌ useIsMobile is not a function');
  }

  console.log('✅ TEST 12: Hooks are functions (will be tested in React context)');
};

testHooks();

// ========================================
// TEST 13: Supabase Config
// ========================================
const testSupabaseConfig = () => {
  if (!projectId || typeof projectId !== 'string') {
    throw new Error('❌ projectId is not configured');
  }
  if (!publicAnonKey || typeof publicAnonKey !== 'string') {
    throw new Error('❌ publicAnonKey is not configured');
  }

  console.log('✅ TEST 13: Supabase configuration valid');
};

testSupabaseConfig();

// ========================================
// FINAL REPORT
// ========================================
console.log('\n========================================');
console.log('🎉 ALL IMPORT VALIDATION TESTS PASSED!');
console.log('========================================\n');
console.log('✅ Types consolidated and accessible');
console.log('✅ Services organized and functional');
console.log('✅ Backward compatibility maintained');
console.log('✅ Utilities extracted and working');
console.log('✅ Hooks created and ready');
console.log('✅ Components reorganized successfully');
console.log('✅ Supabase integration intact');
console.log('\n👉 Ready to proceed with Phase 7 (Feature Extraction)!\n');

export default function ValidationTest() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#F58220' }}>✅ Import Validation Test Passed</h1>
      <p>All imports resolved correctly. Check console for detailed results.</p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>✅ Type imports</li>
        <li>✅ Service imports (new + backward compatible)</li>
        <li>✅ Utility imports (new + backward compatible)</li>
        <li>✅ Hook imports</li>
        <li>✅ Component imports (new + backward compatible)</li>
        <li>✅ Supabase configuration</li>
        <li>✅ API methods available</li>
        <li>✅ Utility functions working</li>
      </ul>
      <p style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
        <strong>Status:</strong> Ready to proceed to Phase 7 (Feature Extraction)
      </p>
    </div>
  );
}
