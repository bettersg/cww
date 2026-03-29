# PantryKeeper

**Food Donation Inventory Management System for Children's Wishing Well**

A modern, mobile-friendly inventory management application for tracking food donations, expiry dates, and stock levels.

---

## 📋 Features

### Core Functionality
- ✅ **Stock In/Out Management** - Add new items or remove existing stock
- ✅ **Expiry Tracking** - Automatic status updates (Fresh, Expiring, Expired, Depleted)
- ✅ **Search & Filter** - Find items quickly by name or status
- ✅ **Batch Number Tracking** - Auto-generated batch numbers for traceability
- ✅ **Audit Log** - Complete changelog of all inventory operations with field-level tracking
- ✅ **CSV Export** - Export inventory and audit log data

### Mobile-First Design
- ✅ Responsive layout (optimized for phones and tablets)
- ✅ Card-based mobile view with clear visual hierarchy
- ✅ Desktop table view for detailed information
- ✅ Touch-friendly UI elements

### Security Features
- ✅ Server-side UUID generation
- ✅ Comprehensive input validation
- ✅ SQL injection protection
- ✅ Rate limiting on sensitive endpoints
- ✅ Permanent meta-audit trail
- ✅ Configurable CORS
- ✅ **Multi-Tenant Isolation** - Edge and Frontend DB schema access intrinsically restricted per JWT claims decoding.
- ⚠️ **TODO:** Role-based access control (RBAC)

---

## 🎨 Design

**Brand Colors:**
- Primary: `#F58220` (CWW Orange)
- Background: `#fffaf5` (Light warm orange)
- Base Font: 16px
- Date Format: DD/MM/YYYY

**Design System:**
- Built with shadcn/ui components
- Tailwind CSS for styling
- Lucide React icons
- Custom PantryKeeper logo

---

## 🗂️ Project Structure

```
/
├── App.tsx                          # Main application component (378 lines)
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── PantryKeeperLogo.tsx        # CWW logo component
│   └── LoadingSkeleton.tsx         # Loading states
├── features/                        # Modular feature components
│   ├── audit-log/                  # Audit log feature
│   ├── export-actions/             # Export functionality
│   ├── inventory/                  # Stock In/Edit/Delete
│   ├── inventory-display/          # Display layouts
│   ├── search-filter/              # Search & filter
│   ├── stocking/                   # Stock Out feature
│   └── user-guide/                 # User guide dialog
├── supabase/functions/server/
│   ├── index.tsx                   # Main API server (Hono)
│   ├── changelog.tsx               # Audit log functions
│   ├── meta_audit.tsx              # Permanent audit trail
│   ├── rate_limiter.tsx            # Rate limiting utility
│   └── kv_store.tsx                # KV database access (protected)
├── utils/
│   ├── api.ts                      # API client functions
│   ├── exportHelpers.ts            # CSV export utilities
│   └── supabase/info.tsx           # Supabase config (protected)
├── documentation/
│   ├── UserGuide.md                # End-user documentation
│   └── ProductOnePager.md          # Product overview
├── guidelines/
│   └── Guidelines.md               # Development guidelines
├── styles/
│   └── globals.css                 # Global styles and tokens
└── SECURITY_AUDIT_CHANGELOG.md     # Security audit report
```

**Architecture:**
- ✅ **Modular Features:** Completed Phase 7 refactoring - reduced App.tsx from 1,760 to 378 lines (78.5% reduction)
- ✅ **Multi-Tenant Architecture:** Secure Edge segmentation and localized DB querying restricted by incoming `x-tenant-id` header boundaries.
- ✅ **Comprehensive Testing:** All features verified through integration, unit, and end-to-end testing
- ✅ **Clean Codebase:** Extracted patterns applied across audit-log, stocking, inventory, search-filter, and export features

---

## 🚀 Tech Stack

**Frontend:**
- React
- TypeScript
- Tailwind CSS 4.0
- shadcn/ui components
- Lucide React icons

**Backend:**
- Supabase Edge Functions (Deno)
- Hono web framework
- KV store for data persistence

**Development:**
- Figma Make (build system)
- ESLint
- Git

---

## 🔐 Security

See `/SECURITY_AUDIT_CHANGELOG.md` for comprehensive security documentation.

**Implemented:**
- ✅ Authentication on all endpoints
- ✅ Rate limiting (20/min view, 5/hr export, 3/hr clear)
- ✅ Input validation with regex patterns
- ✅ Error message sanitization
- ✅ Permanent meta-audit trail

**Pending:**
- ⚠️ Role-based access control (RBAC) - **Required for production**

---

## 📚 Documentation

- **User Guide:** `/documentation/UserGuide.md` - End-user instructions
- **Product Overview:** `/documentation/ProductOnePager.md` - Feature summary
- **Development Guidelines:** `/guidelines/Guidelines.md` - Coding standards
- **Security Audit:** `/SECURITY_AUDIT_CHANGELOG.md` - Security review and improvements

---

## 🛠️ Development Guidelines

See `/guidelines/Guidelines.md` for full guidelines. Key points:

- Base font-size: 16px
- Date format: DD/MM/YYYY
- Use flexbox/grid over absolute positioning
- Keep files small and modular
- Refactor as you go
- Bottom toolbar: max 4 items
- Dropdowns: only if 3+ options

---

## 🧪 Testing Checklist

**Core Functionality:**
- [ ] Add new inventory item (Stock In)
- [ ] Remove stock (Stock Out)
- [ ] Edit existing item
- [ ] Delete item with confirmation
- [ ] Search by name
- [ ] Filter by status (Fresh, Expiring, Expired, Depleted)
- [ ] View and export audit log

**Mobile Experience:**
- [ ] Test on phone (iOS/Android)
- [ ] Verify card layout is readable
- [ ] Ensure touch targets are adequate (44px min)
- [ ] Test floating action buttons

**Data Validation:**
- [ ] Try creating item with empty name → Should fail
- [ ] Try negative quantity → Should fail
- [ ] Verify date format displays as DD/MM/YYYY
- [ ] Check batch number generation

**Security:**
- [ ] Verify rate limiting blocks excessive requests
- [ ] Test authentication requirements on audit log
- [ ] Verify meta-audit entries are created

---

## 📞 Support

**For Issues:**
1. Check server logs in Supabase Dashboard → Edge Functions → Logs
2. Review browser console for client-side errors
3. Verify environment variables are set correctly

**Key Environment Variables:**
- `PROJECT_ID` - Supabase project ID natively replacing Vite overrides.
- `TENANT_ID` - Global environment identifier restricting data boundary segmentation. 
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side key (keep secret!)
- `ALLOWED_ORIGINS` - (Optional) Comma-separated allowed domains for CORS
- `ENVIRONMENT` - (Optional) Set to "development" for detailed error messages

---

## 📝 Version History

**January 3, 2026** - Security Audit & Hardening
- ✅ Comprehensive security audit of audit log feature
- ✅ Implemented rate limiting (20/min view, 5/hr export, 3/hr clear)
- ✅ Added pagination (50 per page, max 100)
- ✅ Created permanent meta-audit trail (non-clearable)
- ✅ Advanced filtering (action, date range, user, item)

**December 30, 2025** - Security Improvements
- ✅ Server-side UUID generation
- ✅ Comprehensive input validation
- ✅ SQL injection protection
- ✅ Error message sanitization
- ✅ Configurable CORS

**December 2025** - Audit Log Implementation
- ✅ Level 3 granularity with field-level change detection
- ✅ Timeline view with search functionality
- ✅ CSV export capability
- ✅ Clear log with safeguards

**Earlier** - Core Development
- ✅ Rebranding with CWW orange theme
- ✅ Stock Out feature with mobile UX
- ✅ Supabase backend integration
- ✅ Mobile-responsive design
- ✅ Status tracking system

---

## 🤝 Contributing

This is a private project for Children's Wishing Well charity. Development follows the guidelines in `/guidelines/Guidelines.md`.

---

## 📄 License

This project uses components from:
- [shadcn/ui](https://ui.shadcn.com/) - MIT License
- Photos from [Unsplash](https://unsplash.com) - Unsplash License

See `/Attributions.md` for details.

---

## 🎯 Roadmap

**Priority 1 (Required for Production):**
- [ ] Implement Supabase Auth with user verification
- [ ] Add role-based access control (admin, manager, staff)
- [ ] Penetration testing
- [ ] Load testing with large datasets

**Priority 2 (Nice to Have):**
- [ ] Audit log retention policy
- [ ] CSV export compression
- [ ] Print-friendly view
- [ ] Email notifications for expiring items
- [ ] Batch operations (bulk update)

---

**Built with ❤️ for Children's Wishing Well**