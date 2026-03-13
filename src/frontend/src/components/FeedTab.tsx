import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CloudRain,
  RefreshCw,
  Snowflake,
  Sun,
  Thermometer,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRecommendations, useRecordFeedback } from "../hooks/useQueries";
import DishCard from "./DishCard";

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Morning";
  if (h >= 12 && h < 17) return "Afternoon";
  if (h >= 17 && h < 21) return "Evening";
  return "Night";
}

const WEATHERS = [
  { id: "Sunny", icon: <Sun className="w-3.5 h-3.5" />, label: "Sunny" },
  { id: "Rainy", icon: <CloudRain className="w-3.5 h-3.5" />, label: "Rainy" },
  { id: "Cold", icon: <Snowflake className="w-3.5 h-3.5" />, label: "Cold" },
  { id: "Hot", icon: <Thermometer className="w-3.5 h-3.5" />, label: "Hot" },
];

export default function FeedTab() {
  const timeOfDay = getTimeOfDay();
  const [weather, setWeather] = useState("Sunny");
  const {
    data: dishes,
    isLoading,
    refetch,
  } = useRecommendations(timeOfDay, weather);
  const recordFeedback = useRecordFeedback();

  const handleFeedback = async (
    dishId: string,
    action: string,
    rating: number,
  ) => {
    await recordFeedback.mutateAsync({ dishId, action, rating });
    toast.success("Taste profile updated ✨", {
      description: "Your AI Food Brain is learning your preferences.",
      duration: 2500,
    });
    refetch();
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Time</span>
              <span className="text-sm font-semibold bg-primary/15 text-primary px-3 py-1 rounded-full">
                {timeOfDay}
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
            onClick={() => refetch()}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Recommended for You
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          AI-curated picks for {timeOfDay.toLowerCase()} · {weather} weather
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

      {!isLoading && dishes && dishes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dishes.slice(0, 10).map((dish, i) => (
            <DishCard
              key={dish.id}
              dish={dish}
              index={i}
              dataOcid={`feed.item.${i + 1}`}
              onLove={() => handleFeedback(dish.id, "love", 5)}
              onDislike={() => handleFeedback(dish.id, "dislike", 1)}
              onOrder={() => handleFeedback(dish.id, "order", 4)}
            />
          ))}
        </div>
      )}

      {!isLoading && (!dishes || dishes.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="feed.empty_state"
          className="glass-card rounded-2xl p-12 text-center"
        >
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Your Food Brain is warming up
          </h3>
          <p className="text-muted-foreground text-sm">
            Building your personalized taste model... Try refreshing in a
            moment.
          </p>
        </motion.div>
      )}
    </div>
  );
}
