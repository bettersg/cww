# Admin Management Policy

**Date:** 3 March 2026

---

## Overview

This document records the decisions made by the CWW team regarding how admin users are managed within the platform.

---

## Decision 1: Admin List Managed by BetterSG

The main admin list will continue to be managed directly by BetterSG rather than delegated to individual CWW centres.

**Rationale:**

- The admin whitelist is currently maintained in Supabase, which is operated and managed by BetterSG.
- Admin user changes are expected to be infrequent — at most once per year per centre.
- Given how periodic these changes are, the overhead of managing updates on BetterSG's end is considered acceptable and proportionate to the effort involved.
- Centralising this responsibility with BetterSG upholds least privilege and access control — only explicitly approved individuals can access the system, with no self-registration or open sign-up. It also reduces the risk of misconfiguration that could arise if individual centres managed their own access grants independently.

**Accepted risks:**

- Centres cannot self-serve access changes. If BetterSG is slow to respond, a centre could be temporarily blocked from onboarding a new admin. This is an acceptable trade-off given the infrequency of changes.
- The "at most once a year" cadence means a departed staff member's account may remain active until the next update cycle. Given that the platform handles food inventory data with no beneficiary PII, this risk is considered low and acceptable for now — but it does require a minimum level of active stewardship from BetterSG to remain so. As the system grows or data sensitivity increases, a more formal offboarding trigger should be considered.

---

## Decision 2: Admins Are Accepted at the Individual Account Level

Admin access will be granted to individual email accounts rather than shared or organisational email addresses.

**Rationale:**

The following recommendation was communicated to Kathina (Clementi CWW Centre) on 3 March 2026:

> Given that admin users are unlikely to change frequently, we recommend using individual emails rather than a shared organisational email. This approach ensures clearer accountability, as the system will be able to identify who added or removed items. It helps reduce confusion, minimise errors, and maintain accurate records over time.

This directly supports accountability and non-repudiation: the system records `lastModifiedBy`, `stockedOutBy`, and a full audit log (`userId`, action, field-level changes) on every operation. Shared or organisational accounts would render these records unreliable and make it impossible to attribute actions to a specific person.

Additional internal reasoning from the PM:

- Since admin users at centres like Clementi CWW do not change often, the administrative overhead of managing individual accounts is minimal.
- Individual accounts improve session traceability — the system can accurately attribute actions to a specific person.
- Using shared email accounts would limit our ability to attribute actions and could restrict how session data is used in the future. Individual accounts keep our options open.

---

## Decision 3: PantryKeeper Team Also Has Admin Access

The core PantryKeeper development and support team (BetterSG) will also hold admin accounts on the platform.

**Rationale:**

- The team requires admin access to support, maintain, and troubleshoot the system on behalf of CWW centres.
- This access is managed internally within BetterSG and does not go through the same centre-facing whitelist process.
- Like centre admins, team members are assigned individual accounts, maintaining the same accountability and non-repudiation standards.

**Accepted risks:**

- Granting the PantryKeeper team admin access expands the total number of privileged accounts. This is legitimate and necessary for support purposes, but it means BetterSG must apply the same standards to its own internal offboarding — removing team members' admin access when they leave the project. This is a lightweight but non-trivial obligation that requires ongoing attention. In the medium to long term, as team membership changes, this becomes a recurring maintenance task that should not be overlooked simply because individual access changes are small in scope.

---

## Long-Term Maintenance Considerations

The current approach is deliberately lightweight and appropriate for the current scale and data sensitivity of PantryKeeper. However, it carries an implicit assumption: that BetterSG remains an active and responsive steward of the admin list.

As the platform matures, the following should be periodically reviewed:

- **Offboarding coverage** — Ensure both centre admin departures and BetterSG team member departures trigger timely access removal. What is currently managed informally may need a more defined process as team size or centre count grows.
- **Audit cadence** — An annual review of the full admin list (both centre and team accounts) is recommended to catch stale accounts and ensure the list reflects current reality.
- **Reassessing centralised control** — If the number of centres grows significantly, the cost of BetterSG managing all access requests may no longer be proportionate. A self-service or delegated model could be revisited at that point.

The risk today is low. The obligation is to ensure it stays low through minimum viable but consistent maintenance.

---

## Summary

| Decision | Outcome |
|---|---|
| Who manages the admin list? | BetterSG manages centrally via Supabase whitelist |
| Account type for admin access | Individual email accounts (not shared/organisational) |
| PantryKeeper team access | Core team holds individual admin accounts for support purposes |

| Security Principle | Status |
|---|---|
| Accountability / Non-Repudiation | Upheld — individual accounts enable accurate audit trails |
| Least Privilege | Upheld — whitelist enforces explicit approval |
| Centralised Access Control | Upheld — BetterSG owns and manages the whitelist |
| Data Minimisation | Upheld — no beneficiary PII collected |
| Timely Offboarding | Partial risk — no formal trigger for immediate removal; acceptable given low data sensitivity, but requires ongoing stewardship |
