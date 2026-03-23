# AI Personal Food Brain

## Current State
Full-stack food recommendation app with onboarding, feed, explore, orders, taste profile, analytics, and admin tabs. Backend in Motoko, frontend in React + TypeScript.

**Root bug:** `isCallerAdmin` function is referenced in `backend.d.ts` and called in the frontend but is NOT implemented in `main.mo`. This causes `isAdmin` to always be `false`, so admin data never loads.

**Secondary admin issues:**
- Restaurant field is a free-text ID input (admin doesn't know restaurant IDs)
- Popularity slider shown to admin (should be auto-set)
- Dish list shows `restaurantId` not restaurant name

## Requested Changes (Diff)

### Add
- `isCallerAdmin` public query function in `main.mo` that returns true if caller has admin role
- Restaurant name dropdown in add/edit dish form (mapped to IDs internally)
- Restaurant name column in the dish table

### Modify
- Remove popularity slider from dish add/edit form (hardcode to 0.75)
- Replace restaurantId text input with restaurant name select dropdown
- Show restaurant name (looked up from restaurant list) in dish table instead of restaurantId

### Remove
- Nothing removed from backend

## Implementation Plan
1. Add `isCallerAdmin` to `main.mo`
2. Update `AdminTab.tsx`: add RESTAURANTS constant mapping name->id, replace restaurantId input with select, remove popularity slider, show restaurant name in dish table, map name->id on save
