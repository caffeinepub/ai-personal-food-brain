import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ChevronLeft,
  Eye,
  Heart,
  LayoutList,
  ShoppingCart,
  ThumbsDown,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Dish } from "../backend.d";

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onLove?: () => void;
  onDislike?: () => void;
  onOrder?: (dish: Dish) => void;
  matchScore?: number;
}

const cuisineColors: Record<string, string> = {
  "North Indian": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  north_indian: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Chinese: "bg-red-500/20 text-red-300 border-red-500/30",
  chinese: "bg-red-500/20 text-red-300 border-red-500/30",
  Italian: "bg-green-500/20 text-green-300 border-green-500/30",
  italian: "bg-green-500/20 text-green-300 border-green-500/30",
  Mexican: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  mexican: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Japanese: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  japanese: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Thai: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  thai: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "South Indian": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  south_indian: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Mediterranean: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  continental: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

const cuisineHeroGradients: Record<string, string> = {
  north_indian:
    "linear-gradient(135deg, oklch(0.25 0.08 45) 0%, oklch(0.18 0.06 30) 50%, oklch(0.14 0.04 55) 100%)",
  "North Indian":
    "linear-gradient(135deg, oklch(0.25 0.08 45) 0%, oklch(0.18 0.06 30) 50%, oklch(0.14 0.04 55) 100%)",
  south_indian:
    "linear-gradient(135deg, oklch(0.25 0.09 75) 0%, oklch(0.18 0.07 60) 50%, oklch(0.14 0.04 80) 100%)",
  "South Indian":
    "linear-gradient(135deg, oklch(0.25 0.09 75) 0%, oklch(0.18 0.07 60) 50%, oklch(0.14 0.04 80) 100%)",
  chinese:
    "linear-gradient(135deg, oklch(0.90 0.08 50) 0%, oklch(0.94 0.06 60) 50%, oklch(0.88 0.10 40) 100%)",
  Chinese:
    "linear-gradient(135deg, oklch(0.90 0.08 50) 0%, oklch(0.94 0.06 60) 50%, oklch(0.88 0.10 40) 100%)",
  italian:
    "linear-gradient(135deg, oklch(0.90 0.08 145) 0%, oklch(0.94 0.06 130) 50%, oklch(0.88 0.07 150) 100%)",
  Italian:
    "linear-gradient(135deg, oklch(0.90 0.08 145) 0%, oklch(0.94 0.06 130) 50%, oklch(0.88 0.07 150) 100%)",
  mexican:
    "linear-gradient(135deg, oklch(0.25 0.09 80) 0%, oklch(0.18 0.07 65) 50%, oklch(0.14 0.04 85) 100%)",
  Mexican:
    "linear-gradient(135deg, oklch(0.25 0.09 80) 0%, oklch(0.18 0.07 65) 50%, oklch(0.14 0.04 85) 100%)",
  japanese:
    "linear-gradient(135deg, oklch(0.90 0.07 350) 0%, oklch(0.94 0.05 340) 50%, oklch(0.88 0.06 0) 100%)",
  Japanese:
    "linear-gradient(135deg, oklch(0.90 0.07 350) 0%, oklch(0.94 0.05 340) 50%, oklch(0.88 0.06 0) 100%)",
  thai: "linear-gradient(135deg, oklch(0.90 0.08 175) 0%, oklch(0.94 0.06 160) 50%, oklch(0.88 0.07 180) 100%)",
  Thai: "linear-gradient(135deg, oklch(0.90 0.08 175) 0%, oklch(0.94 0.06 160) 50%, oklch(0.88 0.07 180) 100%)",
  mediterranean:
    "linear-gradient(135deg, oklch(0.90 0.07 230) 0%, oklch(0.94 0.06 215) 50%, oklch(0.88 0.06 240) 100%)",
  Mediterranean:
    "linear-gradient(135deg, oklch(0.90 0.07 230) 0%, oklch(0.94 0.06 215) 50%, oklch(0.88 0.06 240) 100%)",
  continental:
    "linear-gradient(135deg, oklch(0.90 0.07 230) 0%, oklch(0.94 0.06 215) 50%, oklch(0.88 0.06 240) 100%)",
};

const SIMILAR_DISH_POOL: Array<{
  id: string;
  name: string;
  emoji: string;
  cuisine: string;
  spice: number;
  dietType: string;
  matchScore: number;
}> = [
  {
    id: "s1",
    name: "Butter Chicken",
    emoji: "🍗",
    cuisine: "north_indian",
    spice: 0.4,
    dietType: "non-veg",
    matchScore: 94,
  },
  {
    id: "s2",
    name: "Dal Makhani",
    emoji: "🫘",
    cuisine: "north_indian",
    spice: 0.3,
    dietType: "veg",
    matchScore: 91,
  },
  {
    id: "s3",
    name: "Paneer Tikka",
    emoji: "🧀",
    cuisine: "north_indian",
    spice: 0.5,
    dietType: "veg",
    matchScore: 88,
  },
  {
    id: "s4",
    name: "Chicken Biryani",
    emoji: "🍚",
    cuisine: "south_indian",
    spice: 0.6,
    dietType: "non-veg",
    matchScore: 92,
  },
  {
    id: "s5",
    name: "Masala Dosa",
    emoji: "🥞",
    cuisine: "south_indian",
    spice: 0.35,
    dietType: "veg",
    matchScore: 87,
  },
  {
    id: "s6",
    name: "Kung Pao Chicken",
    emoji: "🥘",
    cuisine: "chinese",
    spice: 0.7,
    dietType: "non-veg",
    matchScore: 85,
  },
  {
    id: "s7",
    name: "Dim Sum",
    emoji: "🥟",
    cuisine: "chinese",
    spice: 0.2,
    dietType: "non-veg",
    matchScore: 83,
  },
  {
    id: "s8",
    name: "Margherita Pizza",
    emoji: "🍕",
    cuisine: "italian",
    spice: 0.1,
    dietType: "veg",
    matchScore: 90,
  },
  {
    id: "s9",
    name: "Spaghetti Carbonara",
    emoji: "🍝",
    cuisine: "italian",
    spice: 0.1,
    dietType: "non-veg",
    matchScore: 89,
  },
  {
    id: "s10",
    name: "Tacos Al Pastor",
    emoji: "🌮",
    cuisine: "mexican",
    spice: 0.65,
    dietType: "non-veg",
    matchScore: 86,
  },
  {
    id: "s11",
    name: "Guacamole Bowl",
    emoji: "🥑",
    cuisine: "mexican",
    spice: 0.3,
    dietType: "vegan",
    matchScore: 84,
  },
  {
    id: "s12",
    name: "Sushi Platter",
    emoji: "🍣",
    cuisine: "japanese",
    spice: 0.15,
    dietType: "non-veg",
    matchScore: 93,
  },
  {
    id: "s13",
    name: "Ramen Bowl",
    emoji: "🍜",
    cuisine: "japanese",
    spice: 0.4,
    dietType: "non-veg",
    matchScore: 91,
  },
  {
    id: "s14",
    name: "Pad Thai",
    emoji: "🍜",
    cuisine: "thai",
    spice: 0.45,
    dietType: "non-veg",
    matchScore: 88,
  },
  {
    id: "s15",
    name: "Green Curry",
    emoji: "🥣",
    cuisine: "thai",
    spice: 0.75,
    dietType: "veg",
    matchScore: 85,
  },
  {
    id: "s16",
    name: "Hummus & Pita",
    emoji: "🧆",
    cuisine: "mediterranean",
    spice: 0.1,
    dietType: "vegan",
    matchScore: 82,
  },
];

function poolItemToDish(item: (typeof SIMILAR_DISH_POOL)[0]): Dish {
  return {
    id: item.id,
    name: item.name,
    cuisine: item.cuisine,
    spice: item.spice,
    sweetness: 0.4,
    richness: 0.5,
    dietType: item.dietType,
    popularity: item.matchScore / 100,
    price: 180 + item.matchScore,
    restaurantId: "Popular Restaurant",
    platform: "both",
    tags: [item.cuisine],
    description: `A delicious ${item.name} prepared with fresh ingredients.`,
  } as unknown as Dish;
}

function getSimilarDishes(dish: Dish, count = 4): typeof SIMILAR_DISH_POOL {
  const cuisine = dish.cuisine.toLowerCase().replace(" ", "_");
  const sameCuisine = SIMILAR_DISH_POOL.filter(
    (d) =>
      d.cuisine === cuisine && d.name.toLowerCase() !== dish.name.toLowerCase(),
  );
  const similarSpice = SIMILAR_DISH_POOL.filter(
    (d) =>
      d.cuisine !== cuisine &&
      d.name.toLowerCase() !== dish.name.toLowerCase() &&
      Math.abs(d.spice - dish.spice) < 0.25,
  );
  const combined = [...sameCuisine, ...similarSpice];
  const seen = new Set<string>();
  const unique = combined.filter((d) => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });
  return unique.slice(0, count);
}

function calcMatchScore(dish: Dish): number {
  return Math.min(
    99,
    Math.max(
      50,
      Math.round(60 + dish.popularity * 35 + Math.sin(dish.price) * 5),
    ),
  );
}

function calcHealthScore(dish: Dish): number {
  const richness = dish.richness ?? 0.5;
  const dietBonus =
    dish.dietType === "vegan" ? 1.5 : dish.dietType === "veg" ? 0.75 : 0;
  return Math.min(5, Math.max(1, Math.round(5 - richness * 2 + dietBonus)));
}

function getDeliveryTime(dish: Dish): number {
  return 20 + Math.round(dish.price % 20);
}

function getSpiceLabel(spice: number): string {
  if (spice < 0.25) return "Mild";
  if (spice < 0.5) return "Medium";
  if (spice < 0.75) return "Hot";
  return "Very Hot";
}

function getSweetnessLabel(sweet: number): string {
  if (sweet < 0.35) return "Low";
  if (sweet < 0.65) return "Medium";
  return "High";
}

function getRichnessLabel(rich: number): string {
  if (rich < 0.35) return "Light";
  if (rich < 0.65) return "Balanced";
  return "Rich";
}

function getUserPrefs() {
  return {
    spice: Number.parseFloat(localStorage.getItem("spicePref") ?? "0.5"),
    sweet: Number.parseFloat(localStorage.getItem("sweetPref") ?? "0.4"),
    rich: Number.parseFloat(localStorage.getItem("richPref") ?? "0.6"),
    dietaryPref: localStorage.getItem("dietaryPref") ?? "any",
    selectedCuisines: (() => {
      try {
        return JSON.parse(
          localStorage.getItem("selectedCuisines") ?? "[]",
        ) as string[];
      } catch {
        return [] as string[];
      }
    })(),
  };
}

function getRecommendationReasons(
  dish: Dish,
  userPrefs: ReturnType<typeof getUserPrefs>,
): string[] {
  const reasons: string[] = [];
  if (
    userPrefs.dietaryPref !== "any" &&
    dish.dietType === userPrefs.dietaryPref
  ) {
    const labels: Record<string, string> = {
      veg: "Vegetarian",
      vegan: "Vegan",
      "non-veg": "Non-Veg",
    };
    reasons.push(
      `Matches your ${labels[userPrefs.dietaryPref] ?? userPrefs.dietaryPref} preference`,
    );
  }
  if (Math.abs(dish.spice - userPrefs.spice) < 0.2)
    reasons.push("Spice level is perfect for you");
  if (
    userPrefs.selectedCuisines.length > 0 &&
    userPrefs.selectedCuisines.includes(
      dish.cuisine.toLowerCase().replace(" ", "_"),
    )
  ) {
    reasons.push("One of your favourite cuisines");
  }
  if (calcHealthScore(dish) >= 4) reasons.push("Healthy choice");
  if (dish.popularity > 0.75) reasons.push("Highly popular dish");
  return reasons.slice(0, 3);
}

function CircleMatchBadge({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="-rotate-90"
          role="img"
          aria-label="Match score ring"
        >
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="oklch(0.25 0.03 260)"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="url(#matchGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
          />
          <defs>
            <linearGradient id="matchGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.75 0.18 55)" />
              <stop offset="100%" stopColor="oklch(0.65 0.20 25)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-primary">{score}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-foreground">
        AI Match Score
      </span>
      <span className="text-[10px] text-muted-foreground text-center">
        Based on your taste profile
      </span>
    </div>
  );
}

function HealthRating({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-2xl transition-opacity ${i <= score ? "opacity-100" : "opacity-20"}`}
          >
            💚
          </span>
        ))}
      </div>
      <span className="text-xs font-semibold text-foreground mt-1">
        Health Rating
      </span>
      <span className="text-[10px] text-muted-foreground text-center">
        Nutritional estimate
      </span>
    </div>
  );
}

function TasteBar({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

function SimilarDishCard({
  dish,
  index,
  onView,
}: {
  dish: (typeof SIMILAR_DISH_POOL)[0];
  index: number;
  onView?: () => void;
}) {
  const [rating, setRating] = useState<"loved" | "disliked" | null>(null);

  const handleLove = () => {
    if (rating === "loved") {
      setRating(null);
      return;
    }
    setRating("loved");
    toast.success(`Loved ${dish.name}! ❤️`, { duration: 2000 });
  };

  const handleDislike = () => {
    if (rating === "disliked") {
      setRating(null);
      return;
    }
    setRating("disliked");
    toast(`${dish.name} skipped`, {
      description: "We'll show you less of this.",
      duration: 2000,
    });
  };

  const isDisliked = rating === "disliked";
  const isLoved = rating === "loved";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isDisliked ? 0.45 : 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="flex-shrink-0 w-[118px] flex flex-col items-center gap-1.5 p-3 rounded-2xl"
      style={{
        background: isLoved
          ? "oklch(0.18 0.06 10 / 0.5)"
          : "oklch(0.14 0.02 260 / 0.6)",
        border: isLoved
          ? "1px solid oklch(0.60 0.18 10 / 0.45)"
          : isDisliked
            ? "1px solid oklch(1 0 0 / 0.04)"
            : "1px solid oklch(1 0 0 / 0.08)",
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      {/* Emoji */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
        style={{
          background: isLoved
            ? "oklch(0.90 0.07 10 / 0.7)"
            : "oklch(0.18 0.04 55 / 0.7)",
          border: isLoved
            ? "1px solid oklch(0.60 0.18 10 / 0.35)"
            : "1px solid oklch(0.75 0.18 55 / 0.2)",
          transition: "background 0.25s, border-color 0.25s",
        }}
      >
        {dish.emoji}
      </div>

      {/* Name */}
      <p className="text-[10px] font-semibold text-foreground text-center leading-tight line-clamp-2 w-full">
        {dish.name}
      </p>

      {/* Match % */}
      <span
        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
        style={{
          background: "oklch(0.75 0.18 55 / 0.15)",
          color: "oklch(0.80 0.18 55)",
          border: "1px solid oklch(0.75 0.18 55 / 0.25)",
        }}
      >
        {dish.matchScore}% match
      </span>

      {/* Love / Dislike buttons */}
      <div className="flex gap-1.5 w-full mt-0.5">
        <button
          type="button"
          data-ocid={`dish.primary_button.${index + 1}` as string}
          onClick={handleLove}
          aria-label={isLoved ? `Unlike ${dish.name}` : `Love ${dish.name}`}
          className="flex-1 flex items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all"
          style={{
            background: isLoved
              ? "oklch(0.55 0.20 10 / 0.25)"
              : "oklch(0.55 0.20 10 / 0.1)",
            border: isLoved
              ? "1px solid oklch(0.55 0.20 10 / 0.55)"
              : "1px solid oklch(0.55 0.20 10 / 0.2)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isLoved ? "filled" : "empty"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Heart
                className="w-3 h-3"
                style={{
                  color: isLoved
                    ? "oklch(0.65 0.22 10)"
                    : "oklch(0.55 0.18 10 / 0.8)",
                  fill: isLoved ? "oklch(0.65 0.22 10)" : "transparent",
                }}
              />
            </motion.span>
          </AnimatePresence>
        </button>

        <button
          type="button"
          data-ocid={`dish.secondary_button.${index + 1}` as string}
          onClick={handleDislike}
          aria-label={
            isDisliked ? `Undo skip ${dish.name}` : `Skip ${dish.name}`
          }
          className="flex-1 flex items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all"
          style={{
            background: isDisliked
              ? "oklch(0.30 0.02 260 / 0.5)"
              : "oklch(0.20 0.02 260 / 0.4)",
            border: isDisliked
              ? "1px solid oklch(0.45 0.04 260 / 0.5)"
              : "1px solid oklch(1 0 0 / 0.1)",
          }}
        >
          <ThumbsDown
            className="w-3 h-3"
            style={{
              color: isDisliked
                ? "oklch(0.70 0.04 260)"
                : "oklch(0.50 0.03 260)",
              fill: isDisliked ? "oklch(0.40 0.04 260 / 0.4)" : "transparent",
            }}
          />
        </button>
      </div>

      {/* View button */}
      <button
        type="button"
        data-ocid={`dish.secondary_button.${index + 1}` as string}
        onClick={onView}
        aria-label={`View details for ${dish.name}`}
        className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all mt-0.5"
        style={{
          background: "oklch(0.20 0.04 260 / 0.5)",
          border: "1px solid oklch(0.75 0.18 55 / 0.2)",
          color: "oklch(0.75 0.18 55)",
        }}
      >
        <Eye className="w-2.5 h-2.5" />
        View
      </button>
    </motion.div>
  );
}

function DishDetailContent({
  dish,
  matchScoreOverride,
  onClose,
  onLove,
  onDislike,
  onOrder,
  onNavigateTo,
  canGoBack,
  onGoBack,
}: {
  dish: Dish;
  matchScoreOverride?: number;
  onClose: () => void;
  onLove?: () => void;
  onDislike?: () => void;
  onOrder?: (dish: Dish) => void;
  onNavigateTo: (dish: Dish) => void;
  canGoBack: boolean;
  onGoBack: () => void;
}) {
  const matchScore = matchScoreOverride ?? calcMatchScore(dish);
  const healthScore = calcHealthScore(dish);
  const deliveryTime = getDeliveryTime(dish);
  const cuisineColor =
    cuisineColors[dish.cuisine] ??
    "bg-purple-500/20 text-purple-300 border-purple-500/30";
  const dietEmoji =
    dish.dietType === "veg" ? "🌿" : dish.dietType === "vegan" ? "🥦" : "🍖";
  const cuisineLabel = dish.cuisine
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const heroGradient =
    cuisineHeroGradients[dish.cuisine] ??
    "linear-gradient(135deg, oklch(0.20 0.06 280) 0%, oklch(0.14 0.04 260) 50%, oklch(0.10 0.03 280) 100%)";

  const userPrefs = getUserPrefs();
  const reasons = getRecommendationReasons(dish, userPrefs);
  const similarDishes = getSimilarDishes(dish, 4);

  const spiceMatch = Math.round(
    100 - Math.abs(dish.spice - userPrefs.spice) * 100,
  );
  const sweetMatch = Math.round(
    100 - Math.abs((dish.sweetness ?? 0.4) - userPrefs.sweet) * 100,
  );
  const richMatch = Math.round(
    100 - Math.abs(dish.richness - userPrefs.rich) * 100,
  );

  const hasSwiggy = dish.platform === "swiggy" || dish.platform === "both";
  const hasZomato = dish.platform === "zomato" || dish.platform === "both";

  const heroEmojis: Record<string, string> = {
    north_indian: "🍛",
    "North Indian": "🍛",
    south_indian: "🫓",
    "South Indian": "🫓",
    chinese: "🥢",
    Chinese: "🥢",
    italian: "🍕",
    Italian: "🍕",
    mexican: "🌮",
    Mexican: "🌮",
    japanese: "🍱",
    Japanese: "🍱",
    thai: "🍜",
    Thai: "🍜",
    mediterranean: "🥙",
    Mediterranean: "🥙",
    continental: "🥗",
  };
  const heroEmoji = heroEmojis[dish.cuisine] ?? "🍽️";

  const handleLove = () => {
    onLove?.();
    toast.success("Added to favorites! ❤️");
    onClose();
  };
  const handleDislike = () => {
    onDislike?.();
    onClose();
  };
  const handleOrder = () => {
    onOrder?.(dish);
    onClose();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Hero image area */}
      <div
        className="relative w-full flex-shrink-0 overflow-hidden"
        style={{ height: "180px", background: heroGradient }}
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.18 55 / 0.6) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, oklch(0.65 0.15 200 / 0.5) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, oklch(1 0 0 / 0.15) 0px, transparent 1px, transparent 24px, oklch(1 0 0 / 0.15) 24px), repeating-linear-gradient(90deg, oklch(1 0 0 / 0.15) 0px, transparent 1px, transparent 24px, oklch(1 0 0 / 0.15) 24px)",
            }}
          />
        </div>

        {/* Back button inside hero */}
        {canGoBack && (
          <motion.button
            type="button"
            data-ocid="dish.cancel_button"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onGoBack}
            aria-label="Go back to previous dish"
            className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors backdrop-blur-sm"
            style={{
              background: "oklch(0 0 0 / 0.45)",
              color: "oklch(0.85 0.05 260)",
              border: "1px solid oklch(1 0 0 / 0.15)",
            }}
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </motion.button>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <motion.div
            key={dish.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="text-6xl"
            style={{ filter: "drop-shadow(0 4px 16px oklch(0 0 0 / 0.5))" }}
          >
            {heroEmoji}
          </motion.div>
          <motion.div
            key={`${dish.id}-score`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: "oklch(0 0 0 / 0.45)",
              color: "oklch(0.80 0.18 55)",
              backdropFilter: "blur(8px)",
              border: "1px solid oklch(0.75 0.18 55 / 0.3)",
            }}
          >
            {matchScore}% AI Match
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.12 0.02 260))",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.75 0.18 55), oklch(0.65 0.20 25))",
          }}
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-6">
          <DialogHeader className="mb-5">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                style={{
                  background: "oklch(0.18 0.04 55 / 0.8)",
                  border: "1px solid oklch(0.75 0.18 55 / 0.25)",
                }}
              >
                {dietEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="font-display text-xl font-bold text-foreground leading-tight mb-1">
                  {dish.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mb-2">
                  {dish.restaurantId}
                </p>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cuisineColor}`}
                  >
                    {cuisineLabel}
                  </span>
                  {hasSwiggy && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: "#FC8019" }}
                    >
                      Swiggy
                    </span>
                  )}
                  {hasZomato && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: "#E23744" }}
                    >
                      Zomato
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Match & Health */}
          <div
            className="grid grid-cols-2 gap-4 p-4 rounded-2xl mb-5"
            style={{
              background: "oklch(0.14 0.02 260 / 0.6)",
              border: "1px solid oklch(1 0 0 / 0.07)",
            }}
          >
            <CircleMatchBadge score={matchScore} />
            <HealthRating score={healthScore} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[
              {
                icon: "💰",
                label: "Price",
                value: `₹${dish.price.toFixed(0)}`,
              },
              { icon: "⏱", label: "Delivery", value: `~${deliveryTime} min` },
              { icon: "🌶", label: "Spice", value: getSpiceLabel(dish.spice) },
              {
                icon: "🍬",
                label: "Sweetness",
                value: getSweetnessLabel(dish.sweetness ?? 0.4),
              },
              {
                icon: "🧈",
                label: "Richness",
                value: getRichnessLabel(dish.richness),
              },
              {
                icon: "🌟",
                label: "Popularity",
                value: `${Math.round(dish.popularity * 100)}%`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-center"
                style={{
                  background: "oklch(0.14 0.02 260 / 0.4)",
                  border: "1px solid oklch(1 0 0 / 0.06)",
                }}
              >
                <span className="text-lg">{stat.icon}</span>
                <span className="text-[10px] text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-xs font-bold text-foreground">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Taste Profile Match */}
          <div
            className="p-4 rounded-2xl mb-5 space-y-3"
            style={{
              background: "oklch(0.14 0.02 260 / 0.5)",
              border: "1px solid oklch(1 0 0 / 0.07)",
            }}
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Taste Profile Match
            </h3>
            <TasteBar
              label="🌶 Spice Match"
              value={spiceMatch}
              color="linear-gradient(90deg, oklch(0.65 0.18 30), oklch(0.55 0.22 20))"
            />
            <TasteBar
              label="🍬 Sweetness Match"
              value={sweetMatch}
              color="linear-gradient(90deg, oklch(0.75 0.15 85), oklch(0.65 0.18 65))"
            />
            <TasteBar
              label="🧈 Richness Match"
              value={richMatch}
              color="linear-gradient(90deg, oklch(0.65 0.12 55), oklch(0.60 0.15 45))"
            />
          </div>

          {/* AI Insight */}
          {reasons.length > 0 && (
            <div
              className="p-4 rounded-2xl mb-5"
              style={{
                background: "oklch(0.16 0.04 140 / 0.3)",
                border: "1px solid oklch(0.55 0.15 140 / 0.25)",
              }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-3">
                AI Insight
              </h3>
              <ul className="space-y-2">
                {reasons.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Similar Dishes */}
          {similarDishes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Similar Dishes
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  You might also like
                </span>
              </div>
              <div
                className="flex gap-2.5 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none" }}
              >
                {similarDishes.map((similar, idx) => (
                  <SimilarDishCard
                    key={similar.id}
                    dish={similar}
                    index={idx}
                    onView={() => onNavigateTo(poolItemToDish(similar))}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed footer */}
      <div
        className="flex-shrink-0 p-4 border-t"
        style={{
          borderColor: "oklch(1 0 0 / 0.08)",
          background: "oklch(0.12 0.02 260)",
        }}
      >
        <div className="grid grid-cols-3 gap-2.5 mb-2">
          <Button
            data-ocid="dish.primary_button"
            variant="ghost"
            onClick={handleLove}
            className="h-11 gap-1.5 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-xl"
          >
            <Heart className="w-4 h-4" />
            Love
          </Button>
          <Button
            data-ocid="dish.secondary_button"
            variant="ghost"
            onClick={handleDislike}
            className="h-11 gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border rounded-xl"
          >
            <ThumbsDown className="w-4 h-4" />
            Skip
          </Button>
          <Button
            data-ocid="dish.submit_button"
            variant="ghost"
            onClick={handleOrder}
            className="h-11 gap-1.5 text-sm text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary/50 rounded-xl"
          >
            <ShoppingCart className="w-4 h-4" />
            Order
          </Button>
        </div>
        {/* Back to dish list */}
        <Button
          data-ocid="dish.cancel_button"
          variant="ghost"
          onClick={onClose}
          className="w-full h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-xl mt-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <LayoutList className="w-3.5 h-3.5" />
          Back to dish list
        </Button>
      </div>
    </div>
  );
}

export default function DishDetailModal({
  dish,
  isOpen,
  onClose,
  onLove,
  onDislike,
  onOrder,
  matchScore: matchScoreOverride,
}: DishDetailModalProps) {
  const [history, setHistory] = useState<Dish[]>([]);
  const [currentDish, setCurrentDish] = useState<Dish | null>(null);

  // Sync currentDish with the dish prop when modal opens or dish changes
  const activeDish = currentDish ?? dish;

  if (!dish) return null;

  const handleNavigateTo = (next: Dish) => {
    setHistory((prev) => [...prev, activeDish ?? dish]);
    setCurrentDish(next);
  };

  const handleGoBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentDish(prev);
  };

  const handleClose = () => {
    setHistory([]);
    setCurrentDish(null);
    onClose();
  };

  const displayDish = activeDish ?? dish;
  const isNavigated = history.length > 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        data-ocid="dish.dialog"
        className="max-w-lg p-0 border-border/60 overflow-hidden bg-card flex flex-col"
        style={{
          height: "min(85vh, 700px)",
          boxShadow: "0 24px 64px oklch(0 0 0 / 0.5)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          data-ocid="dish.close_button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4 text-foreground/70" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={displayDish.id}
            initial={{ opacity: 0, x: isNavigated ? 30 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="flex flex-col flex-1 min-h-0"
          >
            <DishDetailContent
              dish={displayDish}
              matchScoreOverride={isNavigated ? undefined : matchScoreOverride}
              onClose={handleClose}
              onLove={onLove}
              onDislike={onDislike}
              onOrder={onOrder}
              onNavigateTo={handleNavigateTo}
              canGoBack={isNavigated}
              onGoBack={handleGoBack}
            />
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
