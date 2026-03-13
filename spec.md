# AI Personal Food Brain

## Current State
New project. No existing backend or frontend.

## Requested Changes (Diff)

### Add
- Full AI Taste Engine with user taste vector system
- Dish catalog with taste vectors (cuisine, spice, sweetness, richness, texture, ingredients, calories, diet, price, popularity)
- User profile management: diet type, allergies, cuisine preferences, spice tolerance, budget range
- Hybrid recommendation engine (collaborative filtering + content-based + context-aware + RL feedback loop)
- Behavioral signal tracking: clicks, views, orders, ratings, swipes (love/dislike), repeat orders
- Context signals: time of day, day of week, weather, location
- Recommendation output: ranked dishes with taste_match_score, price_match_score, delivery_time
- Learning loop: update taste vector on each interaction, simulate continuous model retraining
- Dashboard: personalized feed, taste profile visualization, recommendation history
- Explore page: browse dishes, apply filters, rate/swipe dishes
- Taste Profile page: view and edit taste vector, cuisine affinities, preference sliders
- Analytics page: recommendation accuracy metrics, learning progress, model evaluation stats

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - UserTasteVector type: spice, sweet, rich, veg, street_food, price_sensitivity, cuisine_affinity map
   - DishTasteVector type: all 10 dish dimensions
   - Dish and Restaurant types with full metadata
   - Behavioral event log per user
   - Recommendation scoring: weighted cosine similarity between user vector and dish vector + context boost
   - Feedback ingestion: update user taste vector via exponential moving average
   - Seed data: 30+ sample dishes across cuisines, 10+ restaurants
   - APIs: getUserProfile, updateUserProfile, getDishes, getRecommendations, recordFeedback, getTasteVector, getAnalytics

2. Frontend (React + TypeScript):
   - Home/Feed: personalized ranked recommendations with match scores
   - Taste Profile: radar chart of taste vector dimensions, cuisine affinity bars, editable preferences
   - Explore: dish grid with filters (cuisine, diet, price, spice), swipe/rate actions
   - Analytics: accuracy trend, learning loop status, evaluation metrics (precision, recall, NDCG)
   - Onboarding: multi-step preference setup wizard
   - Context bar: time of day, simulated weather affecting recommendations
