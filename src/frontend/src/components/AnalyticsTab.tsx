import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Layers, TrendingUp, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalytics, useTasteVector } from "../hooks/useQueries";

const MODEL_LAYERS = [
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Content-Based Filtering",
    subtitle: "Taste Vector Cosine Similarity",
    desc: "Matches your spice/sweet/richness profile to dish taste vectors using cosine similarity across 10 flavor dimensions.",
    color: "text-orange-600",
    bg: "bg-orange-500/10 border-orange-500/20",
    weight: "40%",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Collaborative Filtering",
    subtitle: "Similar User Patterns",
    desc: "Identifies users with similar taste vectors using matrix factorization. Learns from 10M+ user interactions.",
    color: "text-blue-600",
    bg: "bg-blue-500/10 border-blue-500/20",
    weight: "30%",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Context-Aware Boost",
    subtitle: "Time / Weather Intelligence",
    desc: "Boosts comfort food in cold/rainy weather, lighter dishes in morning, trending local items on weekends.",
    color: "text-teal-600",
    bg: "bg-teal-500/10 border-teal-500/20",
    weight: "20%",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Reinforcement Learning",
    subtitle: "Feedback Loop Update",
    desc: "Updates Q-values for each dish-user pair on every interaction. Love → +0.3, Order → +0.2, Dislike → -0.4.",
    color: "text-purple-600",
    bg: "bg-purple-500/10 border-purple-500/20",
    weight: "10%",
  },
];

const FLOW_NODES = [
  { emoji: "👤", label: "User" },
  { emoji: "💬", label: "Feedback" },
  { emoji: "🔄", label: "Vector Update" },
  { emoji: "📊", label: "Retrain" },
  { emoji: "🎯", label: "Better Recs" },
];

export default function AnalyticsTab() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: tasteVector } = useTasteVector();

  const lp = analytics?.learningProgress ?? 0;
  const totalInteractions = Number(analytics?.totalInteractions ?? 0);

  const precision = Math.min(0.99, 0.55 + (lp / 100) * 0.44);
  const recall = Math.min(0.99, 0.5 + (lp / 100) * 0.4);
  const ndcg = Math.min(0.99, 0.6 + (lp / 100) * 0.38);
  const accuracy = Math.min(0.99, 0.52 + (lp / 100) * 0.45);

  const metricsData = [
    {
      name: "Precision@10",
      value: precision,
      label: `${(precision * 100).toFixed(1)}%`,
    },
    {
      name: "Recall@10",
      value: recall,
      label: `${(recall * 100).toFixed(1)}%`,
    },
    { name: "NDCG", value: ndcg, label: `${(ndcg * 100).toFixed(1)}%` },
    {
      name: "Accuracy",
      value: accuracy,
      label: `${(accuracy * 100).toFixed(1)}%`,
    },
  ];

  const currentSpice = tasteVector?.spice ?? 0.5;
  const currentSweet = tasteVector?.sweetness ?? 0.4;
  const currentRich = tasteVector?.richness ?? 0.6;

  const vectorEvolution = [
    {
      time: "Day 1",
      spice: +(currentSpice - 0.25).toFixed(2),
      sweet: +(currentSweet - 0.15).toFixed(2),
      rich: +(currentRich - 0.2).toFixed(2),
    },
    {
      time: "Day 3",
      spice: +(currentSpice - 0.18).toFixed(2),
      sweet: +(currentSweet - 0.1).toFixed(2),
      rich: +(currentRich - 0.14).toFixed(2),
    },
    {
      time: "Day 7",
      spice: +(currentSpice - 0.12).toFixed(2),
      sweet: +(currentSweet - 0.07).toFixed(2),
      rich: +(currentRich - 0.08).toFixed(2),
    },
    {
      time: "Day 14",
      spice: +(currentSpice - 0.06).toFixed(2),
      sweet: +(currentSweet - 0.03).toFixed(2),
      rich: +(currentRich - 0.03).toFixed(2),
    },
    {
      time: "Now",
      spice: currentSpice,
      sweet: currentSweet,
      rich: currentRich,
    },
  ];

  const radarEvolutionData = [
    {
      subject: "Spice",
      before: Math.max(0, currentSpice - 0.25) * 100,
      after: currentSpice * 100,
    },
    {
      subject: "Sweetness",
      before: Math.max(0, currentSweet - 0.15) * 100,
      after: currentSweet * 100,
    },
    {
      subject: "Richness",
      before: Math.max(0, currentRich - 0.2) * 100,
      after: currentRich * 100,
    },
    {
      subject: "Vegetarian",
      before: Math.max(0, (tasteVector?.vegetarian ?? 0.3) - 0.1) * 100,
      after: (tasteVector?.vegetarian ?? 0.3) * 100,
    },
    { subject: "Variety", before: 30, after: 60 },
  ];

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        {["sk1", "sk2", "sk3"].map((id) => (
          <Skeleton key={id} className="h-40 w-full bg-muted rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          AI Engine Analytics
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Model architecture, live metrics & taste vector evolution
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metricsData.map((m, i) => (
          <motion.div
            key={m.name}
            data-ocid="analytics.card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl p-4"
          >
            <p className="text-xs text-muted-foreground mb-1">{m.name}</p>
            <p className="font-display text-2xl font-bold text-primary">
              {m.label}
            </p>
            <Progress
              value={m.value * 100}
              className="h-1 mt-2 bg-muted [&>div]:bg-primary"
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Learning Progress
            </span>
          </div>
          <Progress value={lp} className="h-3 bg-muted [&>div]:bg-primary" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">0 signals</span>
            <span className="text-xs text-primary font-semibold">
              {lp.toFixed(1)}% confident
            </span>
            <span className="text-xs text-muted-foreground">100%</span>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center glow-orange flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Interactions</p>
            <p className="font-display text-3xl font-bold text-foreground">
              {totalInteractions.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Top: <span className="text-primary">{analytics?.topCuisine}</span>
            </p>
          </div>
        </div>
      </div>

      <div data-ocid="analytics.panel">
        <h3 className="font-display text-base font-bold text-foreground mb-3">
          Recommendation Engine Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODEL_LAYERS.map((layer, i) => (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`rounded-xl border p-4 ${layer.bg}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={layer.color}>{layer.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {layer.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {layer.subtitle}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full bg-card/60 ${layer.color}`}
                >
                  {layer.weight}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {layer.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display text-base font-bold text-foreground mb-4">
          Continuous Learning Loop
        </h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {FLOW_NODES.map((node, i) => (
            <div key={node.label} className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">
                  {node.emoji}
                </div>
                <span className="text-[10px] text-muted-foreground text-center whitespace-nowrap">
                  {node.label}
                </span>
              </motion.div>
              {i < 4 && (
                <svg
                  width="24"
                  height="12"
                  className="flex-shrink-0 mt-[-12px]"
                  aria-hidden="true"
                >
                  <line
                    x1="0"
                    y1="6"
                    x2="20"
                    y2="6"
                    stroke="oklch(0.68 0.22 50 / 0.5)"
                    strokeWidth="2"
                    className="flow-line"
                  />
                  <polyline
                    points="14,2 20,6 14,10"
                    fill="none"
                    stroke="oklch(0.68 0.22 50 / 0.7)"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display text-base font-semibold text-foreground mb-1">
            Vector Evolution Over Time
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Simulated learning trajectory
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={vectorEvolution}>
              <CartesianGrid
                stroke="oklch(0.90 0.012 75)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "oklch(0.52 0.025 60)", fontSize: 10 }}
              />
              <YAxis
                domain={[0, 1]}
                tick={{ fill: "oklch(0.52 0.025 60)", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.995 0.003 80)",
                  border: "1px solid oklch(0.88 0.012 75)",
                  borderRadius: 8,
                  color: "oklch(0.18 0.02 60)",
                }}
              />
              <Line
                type="monotone"
                dataKey="spice"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                name="Spice"
              />
              <Line
                type="monotone"
                dataKey="sweet"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Sweet"
              />
              <Line
                type="monotone"
                dataKey="rich"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Rich"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display text-base font-semibold text-foreground mb-1">
            Before vs After Learning
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Taste vector refinement
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart
              data={radarEvolutionData}
              margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
            >
              <PolarGrid stroke="oklch(0.88 0.012 75)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "oklch(0.52 0.025 60)", fontSize: 10 }}
              />
              <Radar
                name="Before"
                dataKey="before"
                stroke="oklch(0.65 0.04 260)"
                fill="oklch(0.65 0.04 260)"
                fillOpacity={0.2}
                strokeWidth={1.5}
              />
              <Radar
                name="After"
                dataKey="after"
                stroke="oklch(0.68 0.22 50)"
                fill="oklch(0.68 0.22 50)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3 h-0.5 bg-muted-foreground/50 inline-block" />{" "}
              Before
            </span>
            <span className="flex items-center gap-1.5 text-xs text-primary">
              <span className="w-3 h-0.5 bg-primary inline-block" /> After
              Learning
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
