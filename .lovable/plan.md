

## Problem

The `mongodb.getShared()` method in `src/lib/mongodb.ts` uses `.single()` when querying the `interviews` table by `share_token`. If no matching row is found (or multiple rows match), Supabase throws: *"Cannot coerce the result to a single JSON object"*.

The user is on `/shared/:id` where `:id` is a share token — if no interview has that token, the `.single()` call fails.

## Fix

In `src/lib/mongodb.ts`, change `.single()` to `.maybeSingle()` in the `getShared` method, and add a check for null result before querying answers. This will gracefully handle missing shared interviews instead of throwing.

### Changes to `src/lib/mongodb.ts`

In the `getShared` function:
- Replace `.single()` with `.maybeSingle()`
- Add a null check: if no interview is found, throw a user-friendly error like "Shared interview not found"

This is a one-line fix plus a guard clause.

