import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Save, Star, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  useAnalytics,
  useCreateOrUpdateProfile,
  useTasteVector,
  useUserProfile,
} from "../hooks/useQueries";

export default function TasteProfileTab() {
  const { data: tasteVector, isLoading: tvLoading } = useTasteVector();
  const { data: profile } = useUserProfile();
  const { data: analytics } = useAnalytics();
  const createProfile = useCreateOrUpdateProfile();

  const [spice, setSpice] = useState<number | null>(null);
  const [sweet, setSweet] = useState<number | null>(null);
  const [rich, setRich] = useState<number | null>(null);

  const currentSpice = spice ?? tasteVector?.spice ?? 0.5;
  const currentSweet = sweet ?? tasteVector?.sweetness ?? 0.4;
  const currentRich = rich ?? tasteVector?.richness ?? 0.6;

  const radarData = [
    { subject: "Spice", A: (tasteVector?.spice ?? 0.5) * 100 },
    { subject: "Sweetness", A: (tasteVector?.sweetness ?? 0.4) * 100 },
    { subject: "Richness", A: (tasteVector?.richness ?? 0.6) * 100 },
    { subject: "Vegetarian", A: (tasteVector?.vegetarian ?? 0.3) * 100 },
    {
      subject: "Variety",
      A: Math.min(100, (tasteVector?.cuisineAffinities?.length ?? 3) * 20),
    },
  ];

  const cuisineData = (
    tasteVector?.cuisineAffinities ?? [
      { cuisine: "North Indian", score: 0.9 },
      { cuisine: "Chinese", score: 0.6 },
      { cuisine: "Italian", score: 0.5 },
      { cuisine: "Mexican", score: 0.3 },
      { cuisine: "Thai", score: 0.4 },
    ]
  ).map((a) => ({ name: a.cuisine, score: Math.round(a.score * 100) }));

  const BAR_COLORS = ["#f97316", "#fb923c", "#f59e0b", "#10b981", "#8b5cf6"];

  const learningProgress = analytics?.learningProgress ?? 0;
  const progressRadius = 40;
  const circumference = 2 * Math.PI * progressRadius;
  const dashOffset = circumference * (1 - learningProgress / 100);

  const handleSave = async () => {
    await createProfile.mutateAsync({
      username: profile?.name ?? "User",
      spice: currentSpice,
      sweet: currentSweet,
      rich: currentRich,
    });
    toast.success("Profile updated!", {
      description: "Your AI is re-calibrating...",
    });
  };

  if (tvLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        {["sk1", "sk2", "sk3"].map((id) => (
          <Skeleton key={id} className="h-48 w-full bg-muted rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          {profile?.name
            ? `${profile.name}'s Taste Profile`
            : "Your Taste Profile"}
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Your AI-learned flavor fingerprint — unique to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-1 text-sm">
            Flavor Dimensions
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Your taste fingerprint across 5 axes
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart
              data={radarData}
              margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
            >
              <PolarGrid stroke="oklch(0.30 0.015 285)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "oklch(0.65 0.015 285)", fontSize: 11 }}
              />
              <Radar
                name="Taste"
                dataKey="A"
                stroke="oklch(0.75 0.18 55)"
                fill="oklch(0.75 0.18 55)"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-1 text-sm">
            Cuisine Affinities
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            AI-learned scores based on your behavior
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={cuisineData}
              layout="vertical"
              margin={{ left: 0, right: 20 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "oklch(0.55 0.015 285)", fontSize: 10 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fill: "oklch(0.65 0.015 285)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.15 0.008 285)",
                  border: "1px solid oklch(0.25 0.015 285)",
                  borderRadius: 8,
                  color: "oklch(0.96 0.008 60)",
                }}
                formatter={(val: number) => [`${val}%`, "Affinity"]}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {cuisineData.map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-5 flex items-center gap-4"
        >
          <div className="relative flex-shrink-0">
            <svg
              width="90"
              height="90"
              viewBox="0 0 90 90"
              aria-label="Learning progress ring"
            >
              <title>Learning progress</title>
              <circle
                cx="45"
                cy="45"
                r={progressRadius}
                fill="none"
                stroke="oklch(0.22 0.012 285)"
                strokeWidth="8"
              />
              <circle
                cx="45"
                cy="45"
                r={progressRadius}
                fill="none"
                stroke="oklch(0.75 0.18 55)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 45 45)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {Math.round(learningProgress)}%
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Learning Progress
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              AI confidence in your taste model
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Top Cuisine
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {analytics?.topCuisine ?? "North Indian"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your most ordered cuisine type
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-foreground">
              Interactions
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {Number(analytics?.totalInteractions ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Feedback signals processed
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="font-semibold text-foreground mb-1">
          Fine-tune Your Preferences
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          Manually adjust to speed up learning. The AI will still adapt from
          your behavior.
        </p>
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label
                htmlFor="profile-spice"
                className="text-sm text-foreground flex items-center gap-2"
              >
                <span>🌶️</span> Spice
              </Label>
              <span className="text-primary text-sm font-bold">
                {Math.round(currentSpice * 100)}%
              </span>
            </div>
            <Slider
              id="profile-spice"
              data-ocid="profile.input"
              value={[currentSpice]}
              onValueChange={([v]) => setSpice(v)}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label
                htmlFor="profile-sweet"
                className="text-sm text-foreground flex items-center gap-2"
              >
                <span>🍯</span> Sweetness
              </Label>
              <span className="text-primary text-sm font-bold">
                {Math.round(currentSweet * 100)}%
              </span>
            </div>
            <Slider
              id="profile-sweet"
              value={[currentSweet]}
              onValueChange={([v]) => setSweet(v)}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label
                htmlFor="profile-rich"
                className="text-sm text-foreground flex items-center gap-2"
              >
                <span>🧈</span> Richness
              </Label>
              <span className="text-primary text-sm font-bold">
                {Math.round(currentRich * 100)}%
              </span>
            </div>
            <Slider
              id="profile-rich"
              value={[currentRich]}
              onValueChange={([v]) => setRich(v)}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
        </div>
        <Button
          data-ocid="profile.save_button"
          onClick={handleSave}
          disabled={createProfile.isPending}
          className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
        >
          <Save className="w-4 h-4" />
          {createProfile.isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </motion.div>

      <div className="glass-card rounded-xl p-4 border-primary/20 bg-primary/5">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-semibold">
            🧠 How the AI learns:
          </span>{" "}
          Every love, skip, and order updates your taste vector in real-time.
          The more you interact, the more accurate your recommendations become.
          Your vector evolves continuously.
        </p>
      </div>
    </div>
  );
}
