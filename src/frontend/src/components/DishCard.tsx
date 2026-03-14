import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ThumbsDown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Dish } from "../backend.d";
import DishDetailModal from "./DishDetailModal";

interface DishCardProps {
  dish: Dish;
  index: number;
  rank?: number;
  matchScoreOverride?: number;
  onLove?: () => void;
  onDislike?: () => void;
  onOrder?: (dish: Dish) => void;
  dataOcid?: string;
}

const cuisineColors: Record<string, string> = {
  "North Indian": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Chinese: "bg-red-500/20 text-red-300 border-red-500/30",
  Italian: "bg-green-500/20 text-green-300 border-green-500/30",
  Mexican: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Japanese: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Thai: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "South Indian": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Mediterranean: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

function getMatchScore(dish: Dish): number {
  return Math.round(60 + dish.popularity * 35 + Math.sin(dish.price) * 5);
}

function getDeliveryTime(dish: Dish): number {
  return 20 + Math.round(dish.price % 20);
}

function getHealthScore(dish: Dish): number {
  const richness = dish.richness ?? 0.5;
  const dietBonus =
    dish.dietType === "vegan" ? 1.5 : dish.dietType === "veg" ? 0.75 : 0;
  const raw = 5 - richness * 2 + dietBonus;
  return Math.min(5, Math.max(1, Math.round(raw)));
}

function SpiceIndicator({ level }: { level: number }) {
  const count = Math.round(level * 4);
  return (
    <div className="flex items-center gap-0.5">
      {["a", "b", "c", "d"].map((id, i) => (
        <span
          key={id}
          className={`text-xs transition-opacity ${i < count ? "opacity-100" : "opacity-20"}`}
        >
          🌶
        </span>
      ))}
    </div>
  );
}

function HealthScore({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-muted-foreground font-medium">
        Health
      </span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-xs transition-opacity ${i <= score ? "opacity-100" : "opacity-20"}`}
          >
            💚
          </span>
        ))}
      </div>
    </div>
  );
}

function PlatformBadges({ platform }: { platform: string }) {
  const hasSwiggy = platform === "swiggy" || platform === "both";
  const hasZomato = platform === "zomato" || platform === "both";
  return (
    <div className="flex items-center gap-1">
      {hasSwiggy && (
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
          style={{ background: "#FC8019" }}
        >
          S
        </span>
      )}
      {hasZomato && (
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
          style={{ background: "#E23744" }}
        >
          Z
        </span>
      )}
    </div>
  );
}

export default function DishCard({
  dish,
  index,
  rank,
  matchScoreOverride,
  onLove,
  onDislike,
  onOrder,
  dataOcid,
}: DishCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);

  const baseScore = Math.min(99, Math.max(50, getMatchScore(dish)));
  const matchScore =
    matchScoreOverride !== undefined
      ? Math.min(99, Math.max(5, matchScoreOverride))
      : baseScore;
  const deliveryTime = getDeliveryTime(dish);
  const healthScore = getHealthScore(dish);
  const cuisineColor =
    cuisineColors[dish.cuisine] ||
    "bg-purple-500/20 text-purple-300 border-purple-500/30";
  const dietEmoji =
    dish.dietType === "veg" ? "🌿" : dish.dietType === "vegan" ? "🥦" : "🍖";

  const rankColor =
    rank === 1
      ? "oklch(0.80 0.20 55)"
      : rank === 2
        ? "oklch(0.75 0.08 220)"
        : rank === 3
          ? "oklch(0.68 0.14 45)"
          : "oklch(0.55 0.04 260)";

  return (
    <>
      <motion.div
        data-ocid={dataOcid}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.04,
          duration: 0.35,
          layout: { duration: 0.4, ease: "easeInOut" },
        }}
        onClick={() => setDetailOpen(true)}
        className="glass-card rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer relative"
        style={{ boxShadow: "0 4px 24px oklch(0 0 0 / 0.3)" }}
      >
        <div
          className="h-1.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.75 0.18 55), oklch(0.65 0.20 25))",
          }}
        />

        {/* Rank badge */}
        {rank !== undefined && (
          <div
            className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black"
            style={{
              background:
                rank <= 3 ? `${rankColor}22` : "oklch(0.18 0.02 260 / 0.8)",
              border: `1.5px solid ${rankColor}`,
              color: rankColor,
              boxShadow: rank <= 3 ? `0 0 8px ${rankColor}44` : "none",
            }}
          >
            #{rank}
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2 flex-1 min-w-0 pl-8">
              <span className="text-xl flex-shrink-0">{dietEmoji}</span>
              <div className="min-w-0">
                <h3 className="font-display font-semibold text-foreground text-base leading-tight line-clamp-1">
                  {dish.name}
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5 truncate">
                  {dish.restaurantId}
                </p>
              </div>
            </div>

            <div
              className="match-badge rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow ml-2"
              style={{ width: 52, height: 52 }}
            >
              <div
                className="bg-background/80 rounded-full flex items-center justify-center"
                style={{ width: 44, height: 44 }}
              >
                <span className="text-xs font-bold text-primary">
                  {matchScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3 mt-2">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cuisineColor}`}
            >
              {dish.cuisine}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
              ₹{dish.price.toFixed(0)}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
              ~{deliveryTime} min
            </span>
            {dish.platform && <PlatformBadges platform={dish.platform} />}
          </div>

          <div className="flex items-center justify-between mb-4">
            <SpiceIndicator level={dish.spice} />
            <HealthScore score={healthScore} />
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLove?.();
              }}
              data-ocid={dataOcid ? `${dataOcid}.button` : undefined}
              className="flex-1 h-8 text-xs gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40"
            >
              <Heart className="w-3 h-3" />
              Love
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDislike?.();
              }}
              className="flex-1 h-8 text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border"
            >
              <ThumbsDown className="w-3 h-3" />
              Skip
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onOrder?.(dish);
              }}
              className="flex-1 h-8 text-xs gap-1 text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary/50"
            >
              <ShoppingCart className="w-3 h-3" />
              Order
            </Button>
          </div>
        </div>
      </motion.div>

      <DishDetailModal
        dish={dish}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onLove={onLove}
        onDislike={onDislike}
        onOrder={onOrder}
        matchScore={matchScore}
      />
    </>
  );
}
