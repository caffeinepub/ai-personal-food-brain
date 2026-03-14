import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Candy,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  User,
  Utensils,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAllDishes, useCreateOrUpdateProfile } from "../hooks/useQueries";

const CUISINES = [
  { id: "north_indian", label: "🍛 North Indian", ocid: "onboarding.item.1" },
  { id: "chinese", label: "🥡 Chinese", ocid: "onboarding.item.2" },
  { id: "italian", label: "🍝 Italian", ocid: "onboarding.item.3" },
  { id: "mexican", label: "🌮 Mexican", ocid: "onboarding.item.4" },
  { id: "japanese", label: "🍱 Japanese", ocid: "onboarding.item.5" },
  { id: "thai", label: "🍜 Thai", ocid: "onboarding.item.6" },
  { id: "south_indian", label: "🥘 South Indian", ocid: "onboarding.item.7" },
  { id: "continental", label: "🥗 Continental", ocid: "onboarding.item.8" },
];

const DIET_OPTIONS = [
  {
    id: "veg",
    emoji: "🌿",
    label: "Vegetarian",
    desc: "No meat, fish or eggs",
    activeClass: "border-green-500 bg-green-500/15 text-green-400",
  },
  {
    id: "non-veg",
    emoji: "🍖",
    label: "Non-Vegetarian",
    desc: "Includes meat & seafood",
    activeClass: "border-orange-500 bg-orange-500/15 text-orange-400",
  },
  {
    id: "vegan",
    emoji: "🥦",
    label: "Vegan",
    desc: "No animal products at all",
    activeClass: "border-emerald-500 bg-emerald-500/15 text-emerald-400",
  },
  {
    id: "any",
    emoji: "🍽️",
    label: "No Preference",
    desc: "Show me everything!",
    activeClass: "border-primary bg-primary/15 text-primary",
  },
];

const MEAL_TIMES = [
  {
    id: "breakfast",
    emoji: "🌅",
    label: "Breakfast",
    desc: "Light morning meals",
    activeClass: "border-yellow-500 bg-yellow-500/15 text-yellow-400",
  },
  {
    id: "lunch",
    emoji: "☀️",
    label: "Lunch",
    desc: "Hearty midday meals",
    activeClass: "border-orange-400 bg-orange-400/15 text-orange-300",
  },
  {
    id: "dinner",
    emoji: "🌙",
    label: "Dinner",
    desc: "Evening comfort food",
    activeClass: "border-indigo-400 bg-indigo-400/15 text-indigo-300",
  },
  {
    id: "evening_snacks",
    emoji: "🫖",
    label: "Evening Snacks",
    desc: "Tea-time bites",
    activeClass: "border-amber-500 bg-amber-500/15 text-amber-400",
  },
];

const DIET_EMOJI: Record<string, string> = {
  veg: "🌿",
  vegan: "🥦",
  "non-veg": "🍖",
};

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
  const [sweet, setSweet] = useState(0.4);
  const [rich, setRich] = useState(0.6);
  // Step 3 — Meal Time
  const [mealTime, setMealTime] = useState<string | null>(null);
  // Step 4 — Cuisines
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    "north_indian",
  ]);

  const createProfile = useCreateOrUpdateProfile();
  // Fetch all dishes at component level (not conditionally)
  const { data: allDishes, isLoading: dishesLoading } = useAllDishes();

  const toggleCuisine = (id: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleFinish = () => {
    // Save completion flag FIRST so even if backend call fails or is slow,
    // user doesn't get stuck in the onboarding loop on reload.
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("dietaryPref", dietPref ?? "any");
    localStorage.setItem("mealTime", mealTime ?? "lunch");
    if (age) localStorage.setItem("userAge", age);
    if (bio) localStorage.setItem("userBio", bio);
    // Immediately transition — don't block on backend
    onComplete();
    // Save to backend in background (fire-and-forget)
    createProfile.mutate({ username: name, spice, sweet, rich });
  };

  // Filter dishes for Step 5
  const filteredDishes = (() => {
    if (!allDishes) return [];
    let dishes = [...allDishes];
    // Diet filter
    if (dietPref === "veg") {
      dishes = dishes.filter(
        (d) => (d.dietType as string).toLowerCase() === "veg",
      );
    } else if (dietPref === "vegan") {
      dishes = dishes.filter(
        (d) => (d.dietType as string).toLowerCase() === "vegan",
      );
    } else if (dietPref === "non-veg") {
      dishes = dishes.filter((d) => {
        const dt = (d.dietType as string).toLowerCase();
        return dt === "non-veg" || dt === "non_veg" || dt === "any";
      });
    }
    // Cuisine filter — case-insensitive partial match
    if (selectedCuisines.length > 0) {
      dishes = dishes.filter((d) => {
        const cuisineLower = (d.cuisine as string)
          .toLowerCase()
          .replace(/ /g, "_");
        return selectedCuisines.some(
          (sc) =>
            cuisineLower.includes(sc.toLowerCase()) ||
            sc.toLowerCase().includes(cuisineLower),
        );
      });
    }
    return dishes.slice(0, 6);
  })();

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
        "Here are dishes matched to your taste profile. You can explore and rate more after launch.",
      icon: <Sparkles className="w-8 h-8 text-primary" />,
    },
  ];

  const canContinue = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return dietPref !== null;
    if (step === 2) return true;
    if (step === 3) return mealTime !== null;
    if (step === 4) return selectedCuisines.length > 0;
    return true; // step 5 — always can finish
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
        className="relative glass-card rounded-3xl p-8 w-full max-w-md"
      >
        {/* Progress bar — 6 steps */}
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
        <p className="text-muted-foreground text-sm mb-8">
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
                    <span>🌶️</span> Spice Tolerance
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
                    <span>🍯</span> Sweetness Preference
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
                    <span>🧈</span> Richness / Creaminess
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

          {/* Step 5 — Personalized Dish Picks */}
          {step === 5 && (
            <motion.div
              key="step5-dishes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3 max-h-72 overflow-y-auto pr-1"
            >
              {dishesLoading ? (
                // Loading skeletons
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/40"
                  >
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                    <Skeleton className="h-3 w-12 rounded" />
                  </div>
                ))
              ) : filteredDishes.length === 0 ? (
                <div
                  data-ocid="onboarding.empty_state"
                  className="text-center py-8 text-muted-foreground"
                >
                  <span className="text-4xl block mb-2">🍽️</span>
                  <p className="text-sm">
                    No dishes matched your filters — you'll discover more in the
                    feed!
                  </p>
                </div>
              ) : (
                filteredDishes.map((dish, idx) => {
                  const dietKey = (dish.dietType as string).toLowerCase();
                  const emoji = DIET_EMOJI[dietKey] ?? "🍽️";
                  const spiceLevel = Math.round(dish.spice * 5);
                  return (
                    <motion.div
                      key={dish.id as string}
                      data-ocid={`onboarding.item.${idx + 1}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/40 hover:border-primary/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {dish.name as string}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dish.cuisine as string} ·{" "}
                          {spiceLevel > 0 ? "🌶️".repeat(spiceLevel) : "mild"}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary whitespace-nowrap">
                        ₹{dish.price as number}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
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
                Launch My Food Brain 🚀
              </span>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
