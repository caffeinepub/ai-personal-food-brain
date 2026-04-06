# AI Personal Food Brain — User Dashboard

## Current State
- App has Feed, Explore, Taste Profile, Analytics, Orders, and Admin tabs.
- User account actions (Edit Profile, Taste History, Preferences, Logout, Delete Account) are buried inside a header avatar dropdown menu.
- No single dedicated dashboard screen exists that surfaces the user's key info at a glance.
- Existing components: FeedTab, TasteProfileTab, MyTasteHistoryModal, MyPreferencesModal, FeedTab (recommendations), OrdersTab.

## Requested Changes (Diff)

### Add
- New `UserDashboard.tsx` component: a dedicated dashboard page surfacing all key user info in one place.
  - **Header greeting** — personalized welcome ("Good morning, Rahul") with avatar, account menu shortcut, and today's date.
  - **What do you want to eat today?** — prominent CTA section: mood/craving selector (e.g., Spicy, Light, Comfort, Quick, Healthy) + a "Get Recommendations" button that navigates to the Feed tab with the selected mood pre-applied.
  - **Taste Profile Summary** — compact radar chart preview of the 5 taste dimensions (spice, sweetness, richness, sourness, bitterness) with a "View Full Profile" link.
  - **Last Dish List Generated** — horizontal scroll card row showing the last 5–10 dishes from the most recent recommendation session, with dish name, match %, cuisine tag, and a quick Love/Order action per card.
  - **Taste History** — timeline list of the last 10 feedback events (dish name, action: loved/disliked/ordered, timestamp), with a "View All" link.
  - **My Account** quick-access tiles: Edit Profile, My Preferences, Order History, Logout — each as a tappable card.
- Export-ready: the component uses only mock/prop data interfaces (typed props + mock constants) so a Python programmer can wire real API data without touching UI code.

### Modify
- `App.tsx`: Add a "Dashboard" tab as the first tab in navigation (before Feed). When the Dashboard's "Get Recommendations" button is clicked, switch to the Feed tab.
- Navigation bar: "Dashboard" tab icon is a grid/home icon.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/components/UserDashboard.tsx` with:
   - Typed prop interfaces (`UserProfile`, `TasteHistoryItem`, `DishRecommendation`, `TasteVector`) with mock defaults.
   - Greeting section.
   - "What to eat today" mood picker + CTA.
   - Radar chart (using Recharts RadarChart already available in the project via recharts).
   - Last dish list horizontal scroll row.
   - Taste history timeline.
   - My Account quick-access tiles.
2. Update `App.tsx` to add the Dashboard tab first and pass `onNavigate` callback.
3. Style consistent with luxury light theme (white backgrounds, orange accents, charcoal text).
