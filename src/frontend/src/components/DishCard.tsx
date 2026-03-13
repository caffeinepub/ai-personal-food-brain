import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ThumbsDown } from "lucide-react";
import { motion } from "motion/react";
import type { Dish } from "../backend.d";

interface DishCardProps {
  dish: Dish;
  index: number;
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
  onLove,
  onDislike,
  onOrder,
  dataOcid,
}: DishCardProps) {
  const matchScore = Math.min(99, Math.max(50, getMatchScore(dish)));
  const deliveryTime = getDeliveryTime(dish);
  const cuisineColor =
    cuisineColors[dish.cuisine] ||
    "bg-purple-500/20 text-purple-300 border-purple-500/30";
  const dietEmoji =
    dish.dietType === "veg" ? "🌿" : dish.dietType === "vegan" ? "🥦" : "🍖";

  return (
    <motion.div
      data-ocid={dataOcid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      style={{ boxShadow: "0 4px 24px oklch(0 0 0 / 0.3)" }}
    >
      <div
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.75 0.18 55), oklch(0.65 0.20 25))",
        }}
      />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{dietEmoji}</span>
            <div>
              <h3 className="font-display font-semibold text-foreground text-base leading-tight line-clamp-1">
                {dish.name}
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                {dish.restaurantId}
              </p>
            </div>
          </div>

          <div
            className="match-badge rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow"
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

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cuisineColor}`}
          >
            {dish.cuisine}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
            ${dish.price.toFixed(0)}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
            ~{deliveryTime} min
          </span>
          {dish.platform && <PlatformBadges platform={dish.platform} />}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <SpiceIndicator level={dish.spice} />
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLove}
            className="flex-1 h-8 text-xs gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40"
          >
            <Heart className="w-3 h-3" />
            Love
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDislike}
            className="flex-1 h-8 text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border"
          >
            <ThumbsDown className="w-3 h-3" />
            Skip
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOrder?.(dish)}
            className="flex-1 h-8 text-xs gap-1 text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary/50"
          >
            <ShoppingCart className="w-3 h-3" />
            Order
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
