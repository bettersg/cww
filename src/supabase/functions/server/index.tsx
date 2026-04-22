import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as changelog from "./changelog.tsx";
import * as rateLimit from "./rate_limiter.tsx";
import * as metaAudit from "./meta_audit.tsx";

const functionName = "make-server-991766ee";
const app = new Hono().basePath(`/${functionName}`);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS - configurable via environment variable
// Set ALLOWED_ORIGINS env var to restrict (comma-separated domains)
// e.g., "https://yourapp.com,https://app.yoursite.com"
const allowedOrigins = Deno.env.get('ALLOWED_ORIGINS');
app.use(
  "/*",
  cors({
    origin: allowedOrigins ? allowedOrigins.split(',') : "*",
    allowHeaders: ["Content-Type", "Authorization", "x-tenant-id"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Content-Disposition"],
    maxAge: 600,
  }),
);

// Utility: Sanitize error messages for production
function handleError(error: unknown, userMessage: string, statusCode = 500) {
  // Always log full error for debugging
  console.error(`[ERROR] ${userMessage}:`, error);

  // In production, hide internal details
  const isDev = Deno.env.get('ENVIRONMENT') === 'development';
  return {
    error: userMessage,
    ...(isDev && { details: String(error) }),
  };
}

// Utility: Validate prefix to prevent LIKE injection
function sanitizePrefix(prefix: string): string {
  // Only allow alphanumeric characters and colons (for our key format)
  if (!/^[a-zA-Z0-9:]+$/.test(prefix)) {
    throw new Error("Invalid prefix format: only alphanumeric and ':' allowed");
  }
  return prefix;
}

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all inventory items
app.get("/items", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const sanitizedPrefix = sanitizePrefix("inventory:");
    const items = await kv.getByPrefix(sanitizedPrefix, authHeader, tenantId);
    console.log(`Fetched ${items.length} inventory items`);
    return c.json({ items: items || [] });
  } catch (error) {
    const errorResponse = handleError(error, "Failed to fetch inventory items");
    return c.json(errorResponse, 500);
  }
});

// Get single inventory item by ID
app.get("/items/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const id = c.req.param("id");
    const item = await kv.get(`inventory:${id}`, authHeader, tenantId);

    if (!item) {
      return c.json({ error: "Item not found" }, 404);
    }

    return c.json({ item });
  } catch (error) {
    const errorResponse = handleError(error, "Failed to fetch inventory item");
    return c.json(errorResponse, 500);
  }
});

// Validation helper
function validateItemData(data: any, isCreate = false) {
  const errors: string[] = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push("name is required and must be a non-empty string");
  } else if (data.name.length > 200) {
    errors.push("name must not exceed 200 characters");
  }

  // Quantity validation
  if (data.quantity === undefined || data.quantity === null) {
    errors.push("quantity is required");
  } else if (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity)) {
    errors.push("quantity must be an integer");
  } else if (data.quantity < 0) {
    errors.push("quantity cannot be negative");
  } else if (data.quantity > 999999) {
    errors.push("quantity is unrealistically large (max: 999999)");
  }

  // Description validation
  if (data.description && typeof data.description !== 'string') {
    errors.push("description must be a string");
  } else if (data.description && data.description.length > 2000) {
    errors.push("description must not exceed 2000 characters");
  }

  // Expiry validation (can be null)
  if (data.expiry !== null && data.expiry !== undefined) {
    if (typeof data.expiry !== 'string') {
      errors.push("expiry must be a string or null");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.expiry)) {
      errors.push("expiry must be in YYYY-MM-DD format");
    }
  }

  // Status validation
  const validStatuses = ["fresh", "expiring", "expired", "depleted"];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`status must be one of: ${validStatuses.join(", ")}`);
  }

  // Batch number validation (required for create)
  if (isCreate && (!data.batchNumber || typeof data.batchNumber !== 'string')) {
    errors.push("batchNumber is required");
  } else if (data.batchNumber && data.batchNumber.length > 50) {
    errors.push("batchNumber must not exceed 50 characters");
  }

  // Received date validation (required for create)
  if (isCreate && (!data.receivedDate || typeof data.receivedDate !== 'string')) {
    errors.push("receivedDate is required");
  }

  // Donor validation
  if (data.donor && data.donor.length > 200) {
    errors.push("donor name must not exceed 200 characters");
  }

  // Modified by validation
  if (data.lastModifiedBy && data.lastModifiedBy.length > 100) {
    errors.push("lastModifiedBy must not exceed 100 characters");
  }

  // Expiring threshold validation
  if (data.expiringThreshold !== undefined) {
    if (typeof data.expiringThreshold !== 'number' || !Number.isInteger(data.expiringThreshold)) {
      errors.push("expiringThreshold must be an integer");
    } else if (data.expiringThreshold < 1 || data.expiringThreshold > 365) {
      errors.push("expiringThreshold must be between 1 and 365 days");
    }
  }

  return errors;
}

// Create new inventory item
app.post("/items", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const body = await c.req.json();

    // Validate input
    const validationErrors = validateItemData(body, true);
    if (validationErrors.length > 0) {
      return c.json({
        error: "Validation failed",
        validationErrors
      }, 400);
    }

    // Generate secure server-side ID (ignore client-provided ID)
    const id = crypto.randomUUID();

    const item = {
      id,
      name: body.name.trim(),
      description: (body.description || "").trim(),
      quantity: body.quantity,
      expiry: body.expiry || null,
      status: body.status || "fresh",
      batchNumber: body.batchNumber,
      receivedDate: body.receivedDate,
      donor: body.donor ? body.donor.trim() : "",
      lastModifiedBy: body.lastModifiedBy ? body.lastModifiedBy.trim() : "",
      lastModifiedDate: body.lastModifiedDate || new Date().toISOString(),
      expiringThreshold: body.expiringThreshold || 7,
    };

    await kv.set(`inventory:${id}`, item, authHeader, tenantId);
    console.log(`Created inventory item: ${id} - ${item.name}`);

    // Create changelog entry for item addition
    await changelog.createChangelogEntry(
      "ITEM_ADDED",
      id,
      item.name,
      item.lastModifiedBy,
      {
        batchNumber: item.batchNumber,
        snapshot: changelog.createItemSnapshot(item),
        authHeader,
        tenantId
      }
    );

    return c.json({ item, message: "Item created successfully" }, 201);
  } catch (error) {
    const errorResponse = handleError(error, "Failed to create inventory item");
    return c.json(errorResponse, 500);
  }
});

// Update existing inventory item
app.put("/items/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const id = c.req.param("id");
    const body = await c.req.json();

    const existingItem = await kv.get(`inventory:${id}`, authHeader, tenantId);
    if (!existingItem) {
      return c.json({ error: "Item not found" }, 404);
    }

    // Validate updates
    const validationErrors = validateItemData(body, false);
    if (validationErrors.length > 0) {
      return c.json({
        error: "Validation failed",
        validationErrors
      }, 400);
    }

    // Sanitize string fields if present
    const updates = { ...body };
    if (updates.name) updates.name = updates.name.trim();
    if (updates.description) updates.description = updates.description.trim();
    if (updates.donor) updates.donor = updates.donor.trim();
    if (updates.lastModifiedBy) updates.lastModifiedBy = updates.lastModifiedBy.trim();

    const updatedItem = {
      ...existingItem,
      ...updates,
      id, // Ensure ID doesn't change
      lastModifiedDate: new Date().toISOString(),
    };

    // Track what changed
    const fieldsChanged = changelog.getChangedFields(existingItem, updatedItem);

    await kv.set(`inventory:${id}`, updatedItem, authHeader, tenantId);
    console.log(`Updated inventory item: ${id}`);

    // Create changelog entry if fields actually changed
    if (fieldsChanged.length > 0) {
      await changelog.createChangelogEntry(
        "ITEM_UPDATED",
        id,
        updatedItem.name,
        updatedItem.lastModifiedBy,
        {
          batchNumber: updatedItem.batchNumber,
          fieldsChanged,
          snapshot: changelog.createItemSnapshot(updatedItem),
          authHeader,
          tenantId
        }
      );
    }

    return c.json({ item: updatedItem, message: "Item updated successfully" });
  } catch (error) {
    const errorResponse = handleError(error, "Failed to update inventory item");
    return c.json(errorResponse, 500);
  }
});

// Delete inventory item
app.delete("/items/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const id = c.req.param("id");

    const existingItem = await kv.get(`inventory:${id}`, authHeader, tenantId);
    if (!existingItem) {
      return c.json({ error: "Item not found" }, 404);
    }

    // Create changelog entry before deletion
    await changelog.createChangelogEntry(
      "ITEM_DELETED",
      id,
      existingItem.name,
      "System", // Could add a query param for who deleted it
      {
        batchNumber: existingItem.batchNumber,
        snapshot: changelog.createItemSnapshot(existingItem),
        authHeader,
        tenantId
      }
    );

    await kv.del(`inventory:${id}`, authHeader, tenantId);
    console.log(`Deleted inventory item: ${id}`);

    return c.json({ message: "Item deleted successfully" });
  } catch (error) {
    const errorResponse = handleError(error, "Failed to delete inventory item");
    return c.json(errorResponse, 500);
  }
});

// Batch distribute items
app.post("/distribute", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const body = await c.req.json();
    const { itemIds, quantities, distributedBy } = body;

    if (!itemIds || !quantities || !Array.isArray(itemIds) || !Array.isArray(quantities)) {
      return c.json({ error: "Invalid request: itemIds and quantities must be arrays" }, 400);
    }

    if (itemIds.length !== quantities.length) {
      return c.json({ error: "itemIds and quantities arrays must have the same length" }, 400);
    }

    const updatedItems = [];
    const errors = [];

    for (let i = 0; i < itemIds.length; i++) {
      const id = itemIds[i];
      const quantityToDistribute = quantities[i];

      try {
        const item = await kv.get(`inventory:${id}`, authHeader, tenantId);

        if (!item) {
          errors.push({ id, error: "Item not found" });
          continue;
        }

        if (item.quantity < quantityToDistribute) {
          errors.push({ id, error: `Insufficient quantity. Available: ${item.quantity}, Requested: ${quantityToDistribute}` });
          continue;
        }

        const newQuantity = item.quantity - quantityToDistribute;
        const updatedItem = {
          ...item,
          quantity: newQuantity,
          status: newQuantity === 0 ? "depleted" : item.status,
          lastModifiedBy: distributedBy || "System",
          lastModifiedDate: new Date().toISOString(),
        };

        await kv.set(`inventory:${id}`, updatedItem, authHeader, tenantId);
        updatedItems.push(updatedItem);
        console.log(`Distributed ${quantityToDistribute} units from item ${id}. New quantity: ${newQuantity}`);
      } catch (itemError) {
        errors.push({ id, error: String(itemError) });
      }
    }

    return c.json({
      message: "Distribution completed",
      updatedItems,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error during batch distribution:", error);
    return c.json({ error: "Failed to distribute items", details: String(error) }, 500);
  }
});

// Stock out items - batch operation to remove quantities from inventory
app.post("/stock-out", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const body = await c.req.json();
    const { items, stockedOutBy } = body;

    // items is an array of { id: string, quantity: number }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Invalid request: items must be a non-empty array" }, 400);
    }

    if (!stockedOutBy || typeof stockedOutBy !== 'string') {
      return c.json({ error: "stockedOutBy is required" }, 400);
    }

    const updatedItems = [];
    const errors = [];

    for (const { id, quantity: quantityToStockOut } of items) {
      try {
        if (!id || quantityToStockOut === undefined || quantityToStockOut <= 0) {
          errors.push({ id, error: "Invalid item: id and positive quantity required" });
          continue;
        }

        const item = await kv.get(`inventory:${id}`, authHeader, tenantId);

        if (!item) {
          errors.push({ id, error: "Item not found" });
          continue;
        }

        if (item.quantity < quantityToStockOut) {
          errors.push({
            id,
            name: item.name,
            error: `Insufficient quantity. Available: ${item.quantity}, Requested: ${quantityToStockOut}`
          });
          continue;
        }

        const newQuantity = item.quantity - quantityToStockOut;

        // Recalculate status based on new quantity
        let newStatus = item.status;
        if (newQuantity === 0) {
          newStatus = "depleted";
        }

        const updatedItem = {
          ...item,
          quantity: newQuantity,
          status: newStatus,
          lastModifiedBy: stockedOutBy,
          lastModifiedDate: new Date().toISOString(),
        };

        await kv.set(`inventory:${id}`, updatedItem, authHeader, tenantId);
        updatedItems.push(updatedItem);
        console.log(`Stocked out ${quantityToStockOut} units from item ${id} (${item.name}). New quantity: ${newQuantity}`);

        // Create changelog entry for stock out
        await changelog.createChangelogEntry(
          "STOCK_OUT",
          id,
          item.name,
          stockedOutBy,
          {
            batchNumber: item.batchNumber,
            fieldsChanged: ["quantity"],
            snapshot: changelog.createItemSnapshot(updatedItem),
            authHeader,
            tenantId
          }
        );
      } catch (itemError) {
        errors.push({ id, error: String(itemError) });
      }
    }

    if (errors.length > 0 && updatedItems.length === 0) {
      return c.json({
        error: "Stock out failed for all items",
        errors
      }, 400);
    }

    return c.json({
      message: `Successfully stocked out ${updatedItems.length} items`,
      updatedItems,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error during stock out operation:", error);
    return c.json({ error: "Failed to stock out items", details: String(error) }, 500);
  }
});

// Initialize database with sample data (one-time setup)
app.post("/initialize", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    // Check if already initialized
    const existingItems = await kv.getByPrefix("inventory:", authHeader, tenantId);
    if (existingItems && existingItems.length > 0) {
      return c.json({ message: "Database already initialized", itemCount: existingItems.length });
    }

    // Sample data - same as the mock data from App.tsx
    const sampleItems = [
      {
        id: "1",
        name: "Paddy King Brown Rice, 5kg",
        description: "Premium brown rice, whole grain",
        quantity: 3,
        expiry: "2026-03-15",
        status: "fresh",
        batchNumber: "PADD-001",
        receivedDate: "2025-08-10",
        donor: "Paddy King Distributor",
        lastModifiedBy: "Sarah Chen",
        lastModifiedDate: "2025-09-15",
        expiringThreshold: 7,
      },
      // You can add more sample items here if needed
    ];

    const keys = sampleItems.map(item => `inventory:${item.id}`);
    await kv.mset(keys, sampleItems, authHeader, tenantId);

    console.log(`Initialized database with ${sampleItems.length} sample items`);
    return c.json({ message: "Database initialized successfully", itemCount: sampleItems.length });
  } catch (error) {
    console.error("Error initializing database:", error);
    return c.json({ error: "Failed to initialize database", details: String(error) }, 500);
  }
});

// Get all changelog entries with pagination and filtering
app.get("/changelog", async (c) => {
  try {
    // SECURITY: Require authentication for audit log access
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Authentication required to access audit log" }, 401);
    }

    // SECURITY: Rate limiting - max 20 requests per minute
    const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
    if (!rateLimit.checkRateLimit(`changelog:${clientIp}`, 20, 60 * 1000)) {
      return c.json({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later."
      }, 429);
    }

    // TODO: Add role-based access control
    // Example: Only allow admin/manager roles to access audit logs
    // const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    // if (!user || !['admin', 'manager'].includes(user.user_metadata?.role)) {
    //   return c.json({ error: "Insufficient permissions" }, 403);
    // }

    // Get query parameters for filtering and pagination
    const page = parseInt(c.req.query('page') || '1');
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100); // Max 100 per page
    const action = c.req.query('action'); // Filter by action type
    const startDate = c.req.query('startDate'); // Filter by date range
    const endDate = c.req.query('endDate');
    const performedBy = c.req.query('performedBy'); // Filter by user
    const itemId = c.req.query('itemId'); // Filter by item

    let entries = await changelog.getAllChangelogEntries(authHeader, tenantId);

    // Apply filters
    if (action) {
      entries = entries.filter(e => e.action === action);
    }
    if (startDate) {
      entries = entries.filter(e => new Date(e.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      entries = entries.filter(e => new Date(e.timestamp) <= new Date(endDate));
    }
    if (performedBy) {
      entries = entries.filter(e => e.performedBy.toLowerCase().includes(performedBy.toLowerCase()));
    }
    if (itemId) {
      entries = entries.filter(e => e.itemId === itemId);
    }

    // Calculate pagination
    const totalCount = entries.length;
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const paginatedEntries = entries.slice(offset, offset + limit);

    // SECURITY: Create meta-audit entry
    await metaAudit.createMetaAuditEntry("AUDIT_VIEWED", {
      ipAddress: clientIp,
      details: {
        page,
        limit,
        filters: { action, startDate, endDate, performedBy, itemId },
        resultCount: paginatedEntries.length
      },
      authHeader,
      tenantId,
    });

    console.log(`[AUDIT] Changelog accessed at ${new Date().toISOString()} from ${clientIp}`);
    console.log(`Fetched page ${page} of ${totalPages} (${paginatedEntries.length} of ${totalCount} entries)`);

    return c.json({
      entries: paginatedEntries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    const errorResponse = handleError(error, "Failed to fetch changelog entries");
    return c.json(errorResponse, 500);
  }
});

// Export changelog as CSV
app.get("/changelog/export", async (c) => {
  try {
    // SECURITY: Require authentication for audit log export
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Authentication required to export audit log" }, 401);
    }

    // SECURITY: Rate limiting - max 5 exports per hour (stricter for export)
    const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
    if (!rateLimit.checkRateLimit(`export:${clientIp}`, 5, 60 * 60 * 1000)) {
      return c.json({
        error: "Rate limit exceeded",
        message: "Too many export requests. Please try again later."
      }, 429);
    }

    const entries = await changelog.getAllChangelogEntries(authHeader, tenantId);

    // SECURITY: Create meta-audit entry for export
    await metaAudit.createMetaAuditEntry("AUDIT_EXPORTED", {
      ipAddress: clientIp,
      details: {
        entryCount: entries.length
      },
      authHeader,
      tenantId,
    });

    console.log(`[AUDIT] Changelog exported at ${new Date().toISOString()} from ${clientIp}`);

    // Helper function to format date in DD/MM/YYYY format
    const formatDate = (isoString: string) => {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Helper function to format time
    const formatTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    // Create CSV header
    const headers = [
      "Date",
      "Time",
      "Action",
      "Item Name",
      "Batch Number",
      "Fields Changed",
      "Current Quantity",
      "Current Expiry",
      "Performed By"
    ];

    // Create CSV rows
    const rows = entries.map(entry => {
      const date = formatDate(entry.timestamp);
      const time = formatTime(entry.timestamp);
      const action = entry.action.replace(/_/g, ' ');
      const itemName = entry.itemName || "";
      const batchNumber = entry.batchNumber || "";
      const fieldsChanged = entry.fieldsChanged?.join(', ') || "N/A";
      const quantity = entry.snapshot?.quantity?.toString() || "";
      const expiry = entry.snapshot?.expiry ? formatDate(entry.snapshot.expiry) : "No expiry";
      const performedBy = entry.performedBy || "System";

      return [
        date,
        time,
        action,
        itemName,
        batchNumber,
        fieldsChanged,
        quantity,
        expiry,
        performedBy
      ];
    });

    // Combine headers and rows with proper CSV escaping
    const escapeCsvValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    // Set headers for CSV download
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="pantrykeeper-audit-log-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting changelog:", error);
    return c.json({ error: "Failed to export changelog", details: String(error) }, 500);
  }
});

// Clear all changelog entries (destructive operation)
app.delete("/changelog", async (c) => {
  try {
    // SECURITY: Require authentication for destructive audit log operations
    const authHeader = c.req.header('Authorization');
    const tenantId = c.req.header('x-tenant-id');
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Authentication required to clear audit log" }, 401);
    }

    // SECURITY: Rate limiting - max 3 clears per hour (very restrictive)
    const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
    if (!rateLimit.checkRateLimit(`clear:${clientIp}`, 3, 60 * 60 * 1000)) {
      await metaAudit.createMetaAuditEntry("AUDIT_CLEARED_ATTEMPT_BLOCKED", {
        ipAddress: clientIp,
        details: {
          reason: "Rate limit exceeded"
        },
        authHeader,
        tenantId,
      });
      return c.json({
        error: "Rate limit exceeded",
        message: "Too many clear requests. Please try again later."
      }, 429);
    }

    // TODO: CRITICAL - Add role-based access control
    // Only admin/superuser should be able to clear audit logs
    // const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    // if (!user || user.user_metadata?.role !== 'admin') {
    //   return c.json({ error: "Insufficient permissions. Admin role required." }, 403);
    // }

    const count = await changelog.clearAllChangelogEntries(authHeader, tenantId);

    // SECURITY: Create permanent meta-audit entry BEFORE clearing
    await metaAudit.createMetaAuditEntry("AUDIT_CLEARED", {
      ipAddress: clientIp,
      details: {
        entriesCleared: count,
        timestamp: new Date().toISOString()
      },
      authHeader,
      tenantId,
    });

    // SECURITY: Log who cleared the audit log
    console.log(`[CRITICAL AUDIT] Changelog cleared at ${new Date().toISOString()} from ${clientIp}`);
    console.log(`[CRITICAL AUDIT] Cleared ${count} entries`);
    console.log(`[CRITICAL AUDIT] WARNING: All audit trail has been removed`);

    return c.json({
      message: "Changelog cleared successfully",
      entriesDeleted: count
    });
  } catch (error) {
    const errorResponse = handleError(error, "Failed to clear changelog");
    return c.json(errorResponse, 500);
  }
});

Deno.serve(app.fetch);