import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CloudRain,
  RefreshCw,
  Snowflake,
  Sun,
  Thermometer,
  Wand2,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Dish } from "../backend.d";
import {
  useRecommendations,
  useRecordFeedback,
  useUserProfile,
} from "../hooks/useQueries";
import DishCard from "./DishCard";
import OrderModal from "./OrderModal";

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Morning";
  if (h >= 12 && h < 17) return "Afternoon";
  if (h >= 17 && h < 21) return "Evening";
  return "Night";
}

function getDietLabel(pref: string | null): { emoji: string; label: string } {
  if (pref === "veg") return { emoji: "🌿", label: "Vegetarian" };
  if (pref === "vegan") return { emoji: "🥦", label: "Vegan" };
  if (pref === "non-veg") return { emoji: "🍖", label: "Non-Veg" };
  return { emoji: "🍽️", label: "All Types" };
}

function getMealTimeLabel(mt: string | null): { emoji: string; label: string } {
  if (mt === "breakfast") return { emoji: "🌅", label: "Breakfast" };
  if (mt === "lunch") return { emoji: "☀️", label: "Lunch" };
  if (mt === "dinner") return { emoji: "🌙", label: "Dinner" };
  if (mt === "evening_snacks") return { emoji: "🫖", label: "Evening Snacks" };
  return { emoji: "🕐", label: "Any Time" };
}

function baseMatchScore(dish: Dish): number {
  return Math.min(
    99,
    Math.max(
      50,
      Math.round(60 + dish.popularity * 35 + Math.sin(dish.price) * 5),
    ),
  );
}

const WEATHERS = [
  { id: "Sunny", icon: <Sun className="w-3.5 h-3.5" />, label: "Sunny" },
  { id: "Rainy", icon: <CloudRain className="w-3.5 h-3.5" />, label: "Rainy" },
  { id: "Cold", icon: <Snowflake className="w-3.5 h-3.5" />, label: "Cold" },
  { id: "Hot", icon: <Thermometer className="w-3.5 h-3.5" />, label: "Hot" },
];

const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "swiggy", label: "🛵 Swiggy", color: "#FC8019" },
  { id: "zomato", label: "🍽️ Zomato", color: "#E23744" },
];

const MEAL_TIME_OPTIONS = [
  { id: "breakfast", emoji: "🌅", label: "Breakfast" },
  { id: "lunch", emoji: "☀️", label: "Lunch" },
  { id: "dinner", emoji: "🌙", label: "Dinner" },
  { id: "evening_snacks", emoji: "🫖", label: "Snacks" },
];

type FeedbackKey = string; // `${dishId}:${action}`

export default function FeedTab() {
  const timeOfDay = getTimeOfDay();
  const [weather, setWeather] = useState("Sunny");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [mealTimeFilter, setMealTimeFilter] = useState<string>(
    () => localStorage.getItem("mealTime") ?? "lunch",
  );
  const [orderDish, setOrderDish] = useState<Dish | null>(null);
  const [matchDeltas, setMatchDeltas] = useState<Record<string, number>>({});

  // Anti-spam: track click counts and thresholds per dish+action
  const feedbackClickCount = useRef<Record<FeedbackKey, number>>({});
  const feedbackThreshold = useRef<Record<FeedbackKey, number>>({});

  const dietaryPref = localStorage.getItem("dietaryPref");
  const dietInfo = getDietLabel(dietaryPref);
  const mealInfo = getMealTimeLabel(mealTimeFilter);

  const {
    data: dishes,
    isLoading,
    refetch,
  } = useRecommendations(timeOfDay, weather);
  const { data: profile } = useUserProfile();
  const recordFeedback = useRecordFeedback();

  const getEffectiveScore = (dish: Dish) =>
    Math.min(
      99,
      Math.max(5, baseMatchScore(dish) + (matchDeltas[dish.id] ?? 0)),
    );

  const handleFeedback = async (
    dishId: string,
    action: string,
    rating: number,
  ) => {
    const key: FeedbackKey = `${dishId}:${action}`;
    const currentCount = (feedbackClickCount.current[key] ?? 0) + 1;
    feedbackClickCount.current[key] = currentCount;

    // First click always counts; subsequent clicks need to hit threshold
    if (currentCount === 1) {
      // Set a random threshold for next effective click (4-6 additional clicks)
      feedbackThreshold.current[key] =
        currentCount + 4 + Math.floor(Math.random() * 3);
    } else if (currentCount < feedbackThreshold.current[key]) {
      // Absorb the click silently
      return;
    } else {
      // Threshold reached -- counts again, set next threshold
      feedbackThreshold.current[key] =
        currentCount + 4 + Math.floor(Math.random() * 3);
    }

    // Update local match delta
    setMatchDeltas((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] ?? 0) + (action === "love" ? 1 : -1),
    }));
    await recordFeedback.mutateAsync({ dishId, action, rating });
    toast.success("Taste profile updated ✨", {
      description: "Your AI Food Brain is learning your preferences.",
      duration: 2500,
    });
    refetch();
  };

  const filteredDishes = (dishes ?? []).filter((d) => {
    if (dietaryPref === "veg" && d.dietType !== "veg") return false;
    if (dietaryPref === "vegan" && d.dietType !== "vegan") return false;
    if (
      platformFilter !== "all" &&
      d.platform !== platformFilter &&
      d.platform !== "both"
    )
      return false;
    return true;
  });

  const sortedDishes = [...filteredDishes]
    .slice(0, 10)
    .sort((a, b) => getEffectiveScore(b) - getEffectiveScore(a));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Time</span>
              <span className="text-sm font-semibold bg-primary/15 text-primary px-3 py-1 rounded-full">
                {timeOfDay}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Diet</span>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  dietaryPref === "veg"
                    ? "bg-green-50 text-green-700"
                    : dietaryPref === "vegan"
                      ? "bg-emerald-50 text-emerald-700"
                      : dietaryPref === "non-veg"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {dietInfo.emoji} {dietInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Weather</span>
              <div className="flex gap-1" data-ocid="feed.toggle">
                {WEATHERS.map((w) => (
                  <button
                    type="button"
                    key={w.id}
                    onClick={() => setWeather(w.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      weather === w.id
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {w.icon}
                    <span className="hidden sm:inline">{w.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button
            data-ocid="feed.primary_button"
            onClick={() => {
              setMatchDeltas({});
              feedbackClickCount.current = {};
              feedbackThreshold.current = {};
              refetch();
            }}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>

        {/* Meal Time Filter */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Meal</span>
          <div className="flex gap-1.5" data-ocid="feed.tab">
            {MEAL_TIME_OPTIONS.map((mt) => (
              <button
                type="button"
                key={mt.id}
                data-ocid="feed.tab"
                onClick={() => {
                  setMealTimeFilter(mt.id);
                  localStorage.setItem("mealTime", mt.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  mealTimeFilter === mt.id
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "text-muted-foreground border-border hover:border-border/80 hover:text-foreground bg-transparent"
                }`}
              >
                <span>{mt.emoji}</span>
                <span className="hidden sm:inline">{mt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Filter */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Platform</span>
          <div className="flex gap-1.5">
            {PLATFORMS.map((p) => (
              <button
                type="button"
                key={p.id}
                data-ocid="feed.tab"
                onClick={() => setPlatformFilter(p.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  platformFilter === p.id
                    ? "text-white border-transparent"
                    : "text-muted-foreground border-border hover:border-border/80 bg-transparent"
                }`}
                style={{
                  background:
                    platformFilter === p.id
                      ? (p.color ?? "oklch(0.75 0.18 55)")
                      : undefined,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Recommended for You
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          {mealInfo.emoji} {mealInfo.label} picks · {timeOfDay.toLowerCase()} ·{" "}
          {weather} weather
          {dietaryPref && dietaryPref !== "any" && (
            <span className="ml-1">
              · {dietInfo.emoji} {dietInfo.label} only
            </span>
          )}
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((id) => (
            <div
              key={id}
              className="glass-card rounded-2xl overflow-hidden"
              data-ocid="feed.loading_state"
            >
              <div className="h-1.5 skeleton-pulse" />
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-3 w-1/2 bg-muted" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full bg-muted" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full bg-muted" />
                  <Skeleton className="h-5 w-14 rounded-full bg-muted" />
                </div>
                <Skeleton className="h-8 w-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && sortedDishes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedDishes.map((dish, i) => (
            <DishCard
              key={dish.id}
              dish={dish}
              index={i}
              rank={i + 1}
              matchScoreOverride={getEffectiveScore(dish)}
              dataOcid={`feed.item.${i + 1}`}
              onLove={() => handleFeedback(dish.id, "love", 5)}
              onDislike={() => handleFeedback(dish.id, "dislike", 1)}
              onOrder={(d) => setOrderDish(d)}
            />
          ))}
        </div>
      )}

      {!isLoading && sortedDishes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="feed.empty_state"
          className="glass-card rounded-2xl p-12 text-center"
        >
          <div className="text-5xl mb-4">{!profile ? "🧠" : "🍽️"}</div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            {!profile
              ? "Set up your taste profile first"
              : "No dishes match this filter"}
          </h3>
          <p className="text-muted-foreground text-sm mb-5">
            {!profile
              ? "Complete the taste quiz so the AI can learn your preferences and serve personalized picks."
              : "Try switching to a different platform or refresh for new recommendations."}
          </p>
          {!profile && (
            <Button
              data-ocid="feed.primary_button"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                document
                  .querySelector('[data-ocid="header.retake_quiz_button"]')
                  ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
              }
            >
              <Wand2 className="w-4 h-4" />
              Take the Taste Quiz
            </Button>
          )}
        </motion.div>
      )}

      <OrderModal
        dish={orderDish}
        isOpen={!!orderDish}
        onClose={() => setOrderDish(null)}
      />
    </div>
  );
}
