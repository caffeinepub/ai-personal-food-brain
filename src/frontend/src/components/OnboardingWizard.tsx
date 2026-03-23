import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Candy,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  ShoppingCart,
  Sparkles,
  ThumbsDown,
  User,
  Utensils,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateOrUpdateProfile } from "../hooks/useQueries";
import DishDetailModal from "./DishDetailModal";

const FALLBACK_DISHES = [
  {
    id: "f1",
    name: "Butter Chicken",
    cuisine: "north_indian",
    dietType: "non-veg",
    spice: 0.6,
    richness: 0.8,
    price: 280,
    sweetness: 0.3,
    popularity: 0.85,
    restaurantId: "Spice Garden",
    platform: "both",
  },
  {
    id: "f2",
    name: "Paneer Tikka Masala",
    cuisine: "north_indian",
    dietType: "veg",
    spice: 0.55,
    richness: 0.7,
    price: 240,
    sweetness: 0.25,
    popularity: 0.78,
    restaurantId: "Spice Garden",
    platform: "swiggy",
  },
  {
    id: "f3",
    name: "Dal Makhani",
    cuisine: "north_indian",
    dietType: "veg",
    spice: 0.3,
    richness: 0.6,
    price: 180,
    sweetness: 0.2,
    popularity: 0.72,
    restaurantId: "Punjabi Dhaba",
    platform: "both",
  },
  {
    id: "f4",
    name: "Palak Tofu",
    cuisine: "north_indian",
    dietType: "vegan",
    spice: 0.4,
    richness: 0.3,
    price: 210,
    sweetness: 0.15,
    popularity: 0.65,
    restaurantId: "Green Bowl",
    platform: "zomato",
  },
  {
    id: "f5",
    name: "Chicken Fried Rice",
    cuisine: "chinese",
    dietType: "non-veg",
    spice: 0.4,
    richness: 0.5,
    price: 200,
    sweetness: 0.3,
    popularity: 0.8,
    restaurantId: "Dragon Palace",
    platform: "both",
  },
  {
    id: "f6",
    name: "Veg Hakka Noodles",
    cuisine: "chinese",
    dietType: "veg",
    spice: 0.45,
    richness: 0.4,
    price: 170,
    sweetness: 0.25,
    popularity: 0.7,
    restaurantId: "Dragon Palace",
    platform: "swiggy",
  },
  {
    id: "f7",
    name: "Mapo Tofu",
    cuisine: "chinese",
    dietType: "vegan",
    spice: 0.7,
    richness: 0.35,
    price: 190,
    sweetness: 0.1,
    popularity: 0.68,
    restaurantId: "Wok Express",
    platform: "zomato",
  },
  {
    id: "f8",
    name: "Margherita Pizza",
    cuisine: "italian",
    dietType: "veg",
    spice: 0.1,
    richness: 0.6,
    price: 320,
    sweetness: 0.35,
    popularity: 0.88,
    restaurantId: "Pizza Pronto",
    platform: "both",
  },
  {
    id: "f9",
    name: "Chicken Pepperoni Pizza",
    cuisine: "italian",
    dietType: "non-veg",
    spice: 0.3,
    richness: 0.65,
    price: 380,
    sweetness: 0.3,
    popularity: 0.9,
    restaurantId: "Pizza Pronto",
    platform: "both",
  },
  {
    id: "f10",
    name: "Pasta Arrabiata (Vegan)",
    cuisine: "italian",
    dietType: "vegan",
    spice: 0.5,
    richness: 0.3,
    price: 290,
    sweetness: 0.2,
    popularity: 0.71,
    restaurantId: "Bella Italia",
    platform: "swiggy",
  },
  {
    id: "f11",
    name: "Chicken Tacos",
    cuisine: "mexican",
    dietType: "non-veg",
    spice: 0.65,
    richness: 0.55,
    price: 260,
    sweetness: 0.2,
    popularity: 0.76,
    restaurantId: "Taco Fiesta",
    platform: "zomato",
  },
  {
    id: "f12",
    name: "Bean & Cheese Burrito",
    cuisine: "mexican",
    dietType: "veg",
    spice: 0.5,
    richness: 0.5,
    price: 230,
    sweetness: 0.25,
    popularity: 0.73,
    restaurantId: "Taco Fiesta",
    platform: "both",
  },
  {
    id: "f13",
    name: "Avocado Taco Bowl",
    cuisine: "mexican",
    dietType: "vegan",
    spice: 0.4,
    richness: 0.25,
    price: 250,
    sweetness: 0.15,
    popularity: 0.67,
    restaurantId: "Verde Kitchen",
    platform: "swiggy",
  },
  {
    id: "f14",
    name: "Chicken Ramen",
    cuisine: "japanese",
    dietType: "non-veg",
    spice: 0.35,
    richness: 0.6,
    price: 340,
    sweetness: 0.3,
    popularity: 0.82,
    restaurantId: "Ramen House",
    platform: "both",
  },
  {
    id: "f15",
    name: "Miso Soup with Tofu",
    cuisine: "japanese",
    dietType: "vegan",
    spice: 0.1,
    richness: 0.2,
    price: 160,
    sweetness: 0.2,
    popularity: 0.6,
    restaurantId: "Zen Garden",
    platform: "zomato",
  },
  {
    id: "f16",
    name: "Pad Thai with Shrimp",
    cuisine: "thai",
    dietType: "non-veg",
    spice: 0.6,
    richness: 0.5,
    price: 300,
    sweetness: 0.35,
    popularity: 0.79,
    restaurantId: "Thai Orchid",
    platform: "both",
  },
  {
    id: "f17",
    name: "Vegetable Green Curry",
    cuisine: "thai",
    dietType: "vegan",
    spice: 0.7,
    richness: 0.35,
    price: 260,
    sweetness: 0.2,
    popularity: 0.69,
    restaurantId: "Thai Orchid",
    platform: "swiggy",
  },
  {
    id: "f18",
    name: "Masala Dosa",
    cuisine: "south_indian",
    dietType: "veg",
    spice: 0.5,
    richness: 0.4,
    price: 140,
    sweetness: 0.15,
    popularity: 0.83,
    restaurantId: "Udupi Express",
    platform: "both",
  },
  {
    id: "f19",
    name: "Chettinad Chicken Curry",
    cuisine: "south_indian",
    dietType: "non-veg",
    spice: 0.8,
    richness: 0.6,
    price: 260,
    sweetness: 0.1,
    popularity: 0.77,
    restaurantId: "Chettinad Kitchen",
    platform: "zomato",
  },
  {
    id: "f20",
    name: "Grilled Mushroom Steak",
    cuisine: "continental",
    dietType: "vegan",
    spice: 0.2,
    richness: 0.2,
    price: 320,
    sweetness: 0.15,
    popularity: 0.64,
    restaurantId: "The Grill House",
    platform: "both",
  },
];

const CUISINES = [
  {
    id: "north_indian",
    label: "\uD83C\uDF5B North Indian",
    ocid: "onboarding.item.1",
  },
  { id: "chinese", label: "\uD83E\uDD61 Chinese", ocid: "onboarding.item.2" },
  { id: "italian", label: "\uD83C\uDF5D Italian", ocid: "onboarding.item.3" },
  { id: "mexican", label: "\uD83C\uDF2E Mexican", ocid: "onboarding.item.4" },
  { id: "japanese", label: "\uD83C\uDF71 Japanese", ocid: "onboarding.item.5" },
  { id: "thai", label: "\uD83C\uDF5C Thai", ocid: "onboarding.item.6" },
  {
    id: "south_indian",
    label: "\uD83E\uDD58 South Indian",
    ocid: "onboarding.item.7",
  },
  {
    id: "continental",
    label: "\uD83E\uDD57 Continental",
    ocid: "onboarding.item.8",
  },
];

const DIET_OPTIONS = [
  {
    id: "veg",
    emoji: "\uD83C\uDF3F",
    label: "Vegetarian",
    desc: "No meat, fish or eggs",
    activeClass: "border-green-500 bg-green-500/15 text-green-400",
  },
  {
    id: "non-veg",
    emoji: "\uD83C\uDF56",
    label: "Non-Vegetarian",
    desc: "Includes meat & seafood",
    activeClass: "border-orange-500 bg-orange-500/15 text-orange-400",
  },
  {
    id: "vegan",
    emoji: "\uD83E\uDD66",
    label: "Vegan",
    desc: "No animal products at all",
    activeClass: "border-emerald-400 bg-emerald-50 text-emerald-700",
  },
  {
    id: "any",
    emoji: "\uD83C\uDF7D\uFE0F",
    label: "No Preference",
    desc: "Show me everything!",
    activeClass: "border-primary bg-primary/15 text-primary",
  },
];

const MEAL_TIMES = [
  {
    id: "breakfast",
    emoji: "\uD83C\uDF05",
    label: "Breakfast",
    desc: "Light morning meals",
    activeClass: "border-yellow-500 bg-yellow-500/15 text-yellow-400",
  },
  {
    id: "lunch",
    emoji: "\u2600\uFE0F",
    label: "Lunch",
    desc: "Hearty midday meals",
    activeClass: "border-orange-400 bg-orange-400/15 text-orange-300",
  },
  {
    id: "dinner",
    emoji: "\uD83C\uDF19",
    label: "Dinner",
    desc: "Evening comfort food",
    activeClass: "border-indigo-400 bg-indigo-400/15 text-indigo-300",
  },
  {
    id: "evening_snacks",
    emoji: "\uD83E\uDEB6",
    label: "Evening Snacks",
    desc: "Tea-time bites",
    activeClass: "border-amber-400 bg-amber-50 text-amber-700",
  },
];

const DIET_EMOJI: Record<string, string> = {
  veg: "\uD83C\uDF3F",
  vegan: "\uD83E\uDD66",
  "non-veg": "\uD83C\uDF56",
};

const cuisineColorMap: Record<string, string> = {
  north_indian: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  chinese: "bg-red-500/20 text-red-300 border-red-500/30",
  italian: "bg-green-500/20 text-green-300 border-green-500/30",
  mexican: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  japanese: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  thai: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  south_indian: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  continental: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

type FallbackDish = (typeof FALLBACK_DISHES)[number];

function calcMatchScore(
  dish: FallbackDish,
  spice: number,
  dietPref: string | null,
): number {
  const dietBonus = dish.dietType === dietPref ? 5 : 0;
  const raw = 70 + (1 - Math.abs(dish.spice - spice)) * 20 + dietBonus;
  return Math.min(99, Math.max(55, Math.round(raw)));
}

function calcHealthScore(dish: FallbackDish): number {
  const dietBonus =
    dish.dietType === "vegan" ? 1.5 : dish.dietType === "veg" ? 0.75 : 0;
  const raw = 5 - dish.richness * 2 + dietBonus;
  return Math.min(5, Math.max(1, Math.round(raw)));
}

// Convert FallbackDish to Dish type for the modal
function toBackendDish(dish: FallbackDish): import("../backend.d").Dish {
  return {
    id: dish.id,
    name: dish.name,
    cuisine: dish.cuisine,
    dietType: dish.dietType,
    spice: dish.spice,
    richness: dish.richness,
    sweetness: dish.sweetness,
    price: dish.price,
    popularity: dish.popularity,
    restaurantId: dish.restaurantId,
    platform: dish.platform,
  };
}

function MiniDishCard({
  dish,
  index,
  spice,
  dietPref,
  rank,
  extraScore,
  scoreAdjust,
}: {
  dish: FallbackDish;
  index: number;
  spice: number;
  dietPref: string | null;
  rank: number;
  extraScore: number;
  scoreAdjust: (id: string, delta: number) => void;
}) {
  const [loved, setLoved] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const clickCountRef = useRef(0);
  const nextThresholdRef = useRef(1);

  const baseMatchScore = calcMatchScore(dish, spice, dietPref);
  const matchScore = Math.min(99, Math.max(0, baseMatchScore + extraScore));
  const healthScore = calcHealthScore(dish);
  const spiceDots = Math.round(dish.spice * 4);
  const dietKey = dish.dietType.toLowerCase();
  const emoji = DIET_EMOJI[dietKey] ?? "\uD83C\uDF7D\uFE0F";
  const cuisineLabel = dish.cuisine
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const cuisineColor =
    cuisineColorMap[dish.cuisine] ||
    "bg-purple-500/20 text-purple-300 border-purple-500/30";

  const handleLove = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickCountRef.current += 1;
    if (clickCountRef.current >= nextThresholdRef.current) {
      scoreAdjust(dish.id, +1);
      nextThresholdRef.current =
        clickCountRef.current + Math.floor(Math.random() * 3) + 4;
    }
    setLoved(true);
    setSkipped(false);
  };
  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickCountRef.current += 1;
    if (clickCountRef.current >= nextThresholdRef.current) {
      scoreAdjust(dish.id, -1);
      nextThresholdRef.current =
        clickCountRef.current + Math.floor(Math.random() * 3) + 4;
    }
    setSkipped(true);
    setLoved(false);
  };
  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("You'll be able to order after launch! \uD83D\uDE80");
  };

  return (
    <>
      <motion.div
        data-ocid={`onboarding.item.${index + 1}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: skipped ? 0.4 : 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.35 }}
        onClick={() => setDetailOpen(true)}
        className="relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer hover:scale-[1.01]"
        style={{
          borderColor: loved
            ? "oklch(0.65 0.18 25 / 0.6)"
            : "oklch(1 0 0 / 0.08)",
          background: loved
            ? "oklch(0.18 0.04 25 / 0.6)"
            : "oklch(0.14 0.02 260 / 0.5)",
          boxShadow: loved ? "0 0 16px oklch(0.65 0.18 25 / 0.2)" : "none",
        }}
      >
        {/* Top gradient bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.75 0.18 55), oklch(0.65 0.20 25))",
          }}
        />

        {/* Rank badge — top left */}
        <div className="absolute top-3 left-3">
          <div
            className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
            style={{
              background:
                rank <= 3
                  ? "oklch(0.75 0.18 55 / 0.9)"
                  : "oklch(0.25 0.03 260 / 0.9)",
              color: rank <= 3 ? "oklch(0.1 0.02 260)" : "oklch(0.7 0.05 260)",
            }}
          >
            #{rank}
          </div>
        </div>

        {/* Match badge — top right */}
        <div className="absolute top-3 right-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(oklch(0.75 0.18 55) 0%, oklch(0.65 0.20 25) ${matchScore}%, oklch(0.25 0.03 260) ${matchScore}%)`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.13 0.02 260)" }}
            >
              <span
                className="text-[9px] font-bold"
                style={{ color: "oklch(0.85 0.15 55)" }}
              >
                {matchScore}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 pr-14">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                {dish.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${cuisineColor}`}
                >
                  {cuisineLabel}
                </span>
                <span className="text-[9px] font-bold text-primary">
                  \u20b9{dish.price}
                </span>
              </div>
            </div>
          </div>

          {/* Spice + Health row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`text-[10px] transition-opacity ${
                    i < spiceDots ? "opacity-100" : "opacity-20"
                  }`}
                >
                  \uD83C\uDF36
                </span>
              ))}
              {spiceDots === 0 && (
                <span className="text-[10px] text-muted-foreground">mild</span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-muted-foreground mr-0.5">
                Health
              </span>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-[10px] transition-opacity ${
                    i <= healthScore ? "opacity-100" : "opacity-20"
                  }`}
                >
                  \uD83D\uDC9A
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLove}
              data-ocid="onboarding.button"
              className={`flex-1 h-7 text-[10px] gap-1 border transition-all ${
                loved
                  ? "text-rose-700 bg-rose-50 border-rose-300"
                  : "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
              }`}
            >
              <Heart className="w-2.5 h-2.5" />
              Love
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className={`flex-1 h-7 text-[10px] gap-1 border transition-all ${
                skipped
                  ? "text-foreground bg-muted/50 border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border"
              }`}
            >
              <ThumbsDown className="w-2.5 h-2.5" />
              Skip
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOrder}
              className="flex-1 h-7 text-[10px] gap-1 text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary/50"
            >
              <ShoppingCart className="w-2.5 h-2.5" />
              Order
            </Button>
          </div>
        </div>
      </motion.div>

      <DishDetailModal
        dish={toBackendDish(dish)}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onLove={() => {
          setLoved(true);
          setSkipped(false);
        }}
        onDislike={() => {
          setSkipped(true);
          setLoved(false);
        }}
        onOrder={() =>
          toast.info("You'll be able to order after launch! \uD83D\uDE80")
        }
        matchScore={matchScore}
      />
    </>
  );
}

export default function OnboardingWizard({
  onComplete,
}: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  // Step 0 — Personal Info
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  // Step 1 — Diet
  const [dietPref, setDietPref] = useState<string | null>(null);
  // Step 2 — Flavors
  const [spice, setSpice] = useState(0.5);
  const [onboardingScoreDeltas, setOnboardingScoreDeltas] = useState<
    Record<string, number>
  >({});
  const [sweet, setSweet] = useState(0.4);
  const [rich, setRich] = useState(0.6);
  // Step 3 — Meal Time
  const [mealTime, setMealTime] = useState<string | null>(null);
  // Step 4 — Cuisines
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    "north_indian",
  ]);

  const createProfile = useCreateOrUpdateProfile();

  const toggleCuisine = (id: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleFinish = () => {
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("dietaryPref", dietPref ?? "any");
    localStorage.setItem("mealTime", mealTime ?? "lunch");
    localStorage.setItem("spicePref", spice.toString());
    localStorage.setItem("sweetPref", sweet.toString());
    localStorage.setItem("richPref", rich.toString());
    localStorage.setItem("selectedCuisines", JSON.stringify(selectedCuisines));
    if (age) localStorage.setItem("userAge", age);
    if (bio) localStorage.setItem("userBio", bio);
    onComplete();
    createProfile.mutate({ username: name, spice, sweet, rich });
  };

  // Filter dishes for Step 5 based on diet + cuisine selection
  const filteredDishes = (() => {
    let dishes = [...FALLBACK_DISHES];
    if (dietPref === "veg") {
      dishes = dishes.filter((d) => d.dietType === "veg");
    } else if (dietPref === "vegan") {
      dishes = dishes.filter((d) => d.dietType === "vegan");
    } else if (dietPref === "non-veg") {
      dishes = dishes.filter((d) => d.dietType === "non-veg");
    }
    if (selectedCuisines.length > 0) {
      dishes = dishes.filter((d) => selectedCuisines.includes(d.cuisine));
    }
    dishes.sort(
      (a, b) =>
        calcMatchScore(b, spice, dietPref) +
        (onboardingScoreDeltas[b.id] ?? 0) -
        (calcMatchScore(a, spice, dietPref) +
          (onboardingScoreDeltas[a.id] ?? 0)),
    );
    return dishes.slice(0, 8);
  })();

  const visibleDishes =
    filteredDishes.length > 0
      ? filteredDishes
      : FALLBACK_DISHES.filter((d) =>
          selectedCuisines.includes(d.cuisine),
        ).slice(0, 6);

  const TOTAL_STEPS = 6;

  const steps = [
    {
      title: "Tell us about yourself",
      subtitle:
        "Your AI Food Brain will build a personal taste profile just for you.",
      icon: <User className="w-8 h-8 text-primary" />,
    },
    {
      title: "What type of food do you eat?",
      subtitle:
        "This is the most important filter — your AI will only show dishes you actually eat.",
      icon: <Utensils className="w-8 h-8 text-primary" />,
    },
    {
      title: "How do you like your food?",
      subtitle:
        "Set your base flavor preferences. The AI will refine these as it learns.",
      icon: <Flame className="w-8 h-8 text-primary" />,
    },
    {
      title: "What meal is this for?",
      subtitle:
        "Choose the meal time so we can tailor your dish recommendations perfectly.",
      icon: <Clock className="w-8 h-8 text-primary" />,
    },
    {
      title: "Pick your favourite cuisines",
      subtitle: "Select all the cuisines you enjoy. Multi-select is fine!",
      icon: <Candy className="w-8 h-8 text-primary" />,
    },
    {
      title: "Your Personalized Picks",
      subtitle:
        "Dishes matched to your taste profile. Tap any dish to see full details!",
      icon: <Sparkles className="w-8 h-8 text-primary" />,
    },
  ];

  const canContinue = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return dietPref !== null;
    if (step === 2) return true;
    if (step === 3) return mealTime !== null;
    if (step === 4) return selectedCuisines.length > 0;
    return true;
  };

  return (
    <div
      className="min-h-screen mesh-bg flex items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('/assets/generated/food-brain-hero-bg.dim_1600x900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Branding top-left */}
      <div className="absolute top-5 left-6 flex items-center gap-2 z-10">
        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <span className="font-display text-sm font-bold text-foreground">
          AI Food Brain
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative glass-card rounded-3xl p-8 w-full ${
          step === 5 ? "max-w-lg" : "max-w-md"
        }`}
      >
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 mb-2">
          {steps[step].icon}
          <span className="text-xs font-medium text-primary uppercase tracking-widest">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          {steps[step].title}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {steps[step].subtitle}
        </p>

        <AnimatePresence mode="wait">
          {/* Step 0 — Personal Info */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="onboarding-name"
                  className="text-sm font-medium text-foreground"
                >
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="onboarding-name"
                  data-ocid="onboarding.input"
                  placeholder="e.g. Priya, Marco, Alex..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base bg-input border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                  onKeyDown={(e) =>
                    e.key === "Enter" && name.trim() && setStep(1)
                  }
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="onboarding-age"
                  className="text-sm font-medium text-foreground"
                >
                  Age{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="onboarding-age"
                  data-ocid="onboarding.input"
                  type="number"
                  placeholder="Your age"
                  value={age}
                  min={1}
                  max={120}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-11 text-base bg-input border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="onboarding-bio"
                  className="text-sm font-medium text-foreground"
                >
                  Food Motto{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="onboarding-bio"
                  data-ocid="onboarding.textarea"
                  placeholder="e.g. Love exploring street food..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="resize-none bg-input border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                  rows={2}
                />
              </div>
            </motion.div>
          )}

          {/* Step 1 — Diet Type */}
          {step === 1 && (
            <motion.div
              key="step1-diet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-3"
            >
              {DIET_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  data-ocid="onboarding.radio"
                  onClick={() => setDietPref(opt.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    dietPref === opt.id
                      ? opt.activeClass
                      : "border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-sm font-semibold leading-tight">
                    {opt.label}
                  </span>
                  <span className="text-xs opacity-70 leading-tight">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 2 — Flavor Preferences */}
          {step === 2 && (
            <motion.div
              key="step2-flavors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="onboarding-spice"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <span>\uD83C\uDF36\uFE0F</span> Spice Tolerance
                  </Label>
                  <span className="text-primary font-bold text-sm">
                    {Math.round(spice * 100)}%
                  </span>
                </div>
                <Slider
                  id="onboarding-spice"
                  value={[spice]}
                  onValueChange={([v]) => setSpice(v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="onboarding-sweet"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <span>\uD83C\uDF6F</span> Sweetness Preference
                  </Label>
                  <span className="text-primary font-bold text-sm">
                    {Math.round(sweet * 100)}%
                  </span>
                </div>
                <Slider
                  id="onboarding-sweet"
                  value={[sweet]}
                  onValueChange={([v]) => setSweet(v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="onboarding-rich"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <span>\uD83E\uDDC8</span> Richness / Creaminess
                  </Label>
                  <span className="text-primary font-bold text-sm">
                    {Math.round(rich * 100)}%
                  </span>
                </div>
                <Slider
                  id="onboarding-rich"
                  value={[rich]}
                  onValueChange={([v]) => setRich(v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
            </motion.div>
          )}

          {/* Step 3 — Meal Time */}
          {step === 3 && (
            <motion.div
              key="step3-mealtime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-3"
            >
              {MEAL_TIMES.map((mt) => (
                <button
                  type="button"
                  key={mt.id}
                  data-ocid="onboarding.radio"
                  onClick={() => setMealTime(mt.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    mealTime === mt.id
                      ? mt.activeClass
                      : "border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  <span className="text-3xl">{mt.emoji}</span>
                  <span className="text-sm font-semibold leading-tight">
                    {mt.label}
                  </span>
                  <span className="text-xs opacity-70 leading-tight">
                    {mt.desc}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 4 — Cuisine Selection */}
          {step === 4 && (
            <motion.div
              key="step4-cuisines"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-3"
            >
              {CUISINES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  data-ocid={c.ocid}
                  onClick={() => toggleCuisine(c.id)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    selectedCuisines.includes(c.id)
                      ? "border-primary bg-primary/15 text-primary glow-orange"
                      : "border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 5 — Personalized Dish Picks (rich cards) */}
          {step === 5 && (
            <motion.div
              key="step5-dishes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {visibleDishes.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No dishes found — try selecting more cuisines above.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 max-h-96 overflow-y-auto pr-1">
                  {visibleDishes.map((dish, idx) => (
                    <MiniDishCard
                      key={dish.id}
                      dish={dish}
                      index={idx}
                      spice={spice}
                      dietPref={dietPref}
                      rank={idx + 1}
                      extraScore={onboardingScoreDeltas[dish.id] ?? 0}
                      scoreAdjust={(id, delta) =>
                        setOnboardingScoreDeltas((prev) => ({
                          ...prev,
                          [id]: (prev[id] ?? 0) + delta,
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 border-border text-muted-foreground hover:text-foreground"
            >
              Back
            </Button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canContinue()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              data-ocid="onboarding.submit_button"
              onClick={handleFinish}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Launch My Food Brain \uD83D\uDE80
              </span>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
