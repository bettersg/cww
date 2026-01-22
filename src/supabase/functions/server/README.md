# PantryKeeper Edge Function Server

## Overview
This is the backend server for PantryKeeper, running as a Supabase Edge Function using Hono web framework and Deno runtime.

## Endpoints

### Health Check
- **GET** `/make-server-991766ee/health` - Check if server is running

### Inventory Management
- **GET** `/make-server-991766ee/items` - Get all inventory items
- **GET** `/make-server-991766ee/items/:id` - Get single item
- **POST** `/make-server-991766ee/items` - Create new item
- **PUT** `/make-server-991766ee/items/:id` - Update item
- **DELETE** `/make-server-991766ee/items/:id` - Delete item

### Stocking Operations
- **POST** `/make-server-991766ee/stock-out` - Stock out items
- **POST** `/make-server-991766ee/distribute` - Distribute items

### Audit Log
- **GET** `/make-server-991766ee/changelog` - Get changelog entries (requires auth)
- **GET** `/make-server-991766ee/changelog/export` - Export changelog as CSV (requires auth)
- **DELETE** `/make-server-991766ee/changelog` - Clear changelog (requires auth)

### Database Setup
- **POST** `/make-server-991766ee/initialize` - Initialize database with sample data

## Deployment

### Automatic Deployment (Figma Make)
This Edge Function should automatically deploy when you:
1. Save changes to any file in `/supabase/functions/server/`
2. The function will be available at: `https://{projectId}.supabase.co/functions/v1/make-server-991766ee`

### Manual Deployment (if needed)
If the function is not deploying automatically:

1. Check the Supabase project dashboard
2. Navigate to Edge Functions section
3. Ensure the function named "make-server-991766ee" exists
4. Manually trigger a deployment if needed

### Testing the Deployment
You can test if the server is running by visiting:
```
https://qmcbbwpwvezvrihtsyqr.supabase.co/functions/v1/make-server-991766ee/health
```

Expected response:
```json
{"status": "ok"}
```

## Troubleshooting

### "Failed to fetch" Error
If you see this error in the browser console:
1. The Edge Function may not be deployed yet
2. Check the URL in your browser's network tab
3. Try initializing the database from the app's Export menu

### CORS Errors
- CORS is configured to allow all origins by default
- For production, set the `ALLOWED_ORIGINS` environment variable

### Database Not Initialized
If you see empty inventory:
1. Click "Export" dropdown in the app header
2. Select "Initialize Database"
3. This will create sample data

## Environment Variables
The following environment variables are automatically configured:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)

## Files
- `index.tsx` - Main server file with all routes
- `kv_store.tsx` - Key-value store utilities
- `changelog.tsx` - Audit log utilities
- `meta_audit.tsx` - Meta-audit logging
- `rate_limiter.tsx` - Rate limiting utilities
- `deno.json` - Deno configuration
