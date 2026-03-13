# AI Personal Food Brain

## Current State
- Backend in Motoko with UserProfile, TasteVector, Dish, and FeedbackRecord types
- Backend APIs: `createOrUpdateProfile`, `getCallerUserProfile`, `getAllDishes`, `getRecommendations`, `recordFeedback`, `getTasteVector`, `getAnalytics`
- Frontend: Onboarding wizard, Feed tab (recommendations), Explore tab, Taste Profile tab, Analytics tab
- Role-based access control via `authorization` component: principals must be registered as `#user` to call protected APIs
- **Bug**: New users are NOT auto-registered with `#user` role, so all protected calls trap, `.catch()` returns `[]`, Feed shows "warming up" empty state indefinitely
- No delivery platform integration or order tracking exists

## Requested Changes (Diff)

### Add
- **Auto-registration fix**: Backend functions auto-assign `#user` role to unregistered non-anonymous callers so they can immediately use the app
- **DeliveryOrder type**: `{ id, userId, dishId, dishName, platform ("swiggy"|"zomato"), status ("placed"|"preparing"|"out_for_delivery"|"delivered"), deliveryAddress, estimatedMinutes, price, placedAt, updatedAt }`
- **`placeOrder(dishId, platform, deliveryAddress)` API**: Creates order record, records feedback ("order"), returns order ID
- **`getMyOrders()` API**: Returns all orders for the caller, sorted by newest first
- **`updateOrderStatus(orderId, newStatus)` API**: Admin or simulated background update for order lifecycle
- **`getPlatformDishes(platform)` API**: Returns simulated dishes available from the selected platform (Swiggy vs Zomato brand names, slightly different menus)
- **`getOrderTasteHistory()` API**: Returns aggregated taste stats from past orders (cuisine breakdown, avg spice/richness)
- **Orders tab** in frontend: Shows live order tracking with status timeline, order cards, platform badges
- **Platform selector** on dish cards in Feed and Explore: "Order via Swiggy" and "Order via Zomato" buttons with platform branding colors
- **Order modal/sheet**: Address input, platform choice, estimated delivery time, confirm order button
- **Taste History section** in Taste Profile tab: Orders-based learning signal, cuisine frequency from orders
- **Simulated order status progression**: Orders auto-advance through statuses on a timer in the frontend

### Modify
- `createOrUpdateProfile` and other protected backend functions: add auto-registration of caller as `#user` before the permission check
- `getRecommendations`: Also return recommendations even with no feedback history (seed from onboarding preferences)
- FeedTab: Replace "warming up" empty state with a proper taste-model-initialization flow that works immediately after onboarding
- App.tsx: Add Orders tab to navigation
- DishCard: Add platform order buttons

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo`: add auto-user-registration helper, add DeliveryOrder types and storage, add order APIs, add `getPlatformDishes`, add `getOrderTasteHistory`
2. Regenerate `backend.d.ts` via `generate_motoko_code`
3. Update `useQueries.ts`: add `usePlaceOrder`, `useMyOrders`, `useUpdateOrderStatus`, `usePlatformDishes`, `useOrderTasteHistory` hooks
4. Add `OrdersTab.tsx`: order list with status timeline, platform badge
5. Add `OrderModal.tsx`: address entry + platform pick + confirm
6. Update `DishCard.tsx`: add platform order buttons that open OrderModal
7. Update `FeedTab.tsx`: fix empty-state wording, ensure recs load on first visit
8. Update `TasteProfileTab.tsx`: add order-based taste history section
9. Update `App.tsx`: add Orders tab (ShoppingBag icon)
