import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Clock,
  Heart,
  LayoutList,
  LogOut,
  Settings,
  ShoppingBag,
  Sliders,
  Sparkles,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

// ──────────────────────────────────────────────
// Exported interfaces for backend integration
// ──────────────────────────────────────────────

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  dietType: string; // "Veg" | "Non-veg" | "Vegan" | "Any"
}

export interface TasteVector {
  spice: number; // 0–10
  sweetness: number;
  richness: number;
  sourness: number;
  bitterness: number;
}

export interface TasteHistoryItem {
  id: string;
  dishName: string;
  action: "loved" | "disliked" | "ordered";
  timestamp: string; // ISO string
  cuisine: string;
}

export interface DishRecommendation {
  id: string;
  name: string;
  matchPercent: number;
  cuisine: string;
  dietType: string; // "vegetarian" | "non-vegetarian" | "vegan"
  imageUrl?: string;
  restaurantName: string;
  isHealthy: boolean;
}

export interface UserDashboardProps {
  user: UserProfile;
  tasteVector: TasteVector;
  tasteHistory: TasteHistoryItem[];
  lastDishList: DishRecommendation[];
  onNavigateToFeed: (mood?: string) => void;
  onNavigateToFullProfile: () => void;
  onNavigateToOrders: () => void;
  onEditProfile: () => void;
  onMyPreferences: () => void;
  onLogout: () => void;
}

// ──────────────────────────────────────────────
// Mock default data
// ──────────────────────────────────────────────

export const MOCK_USER_DASHBOARD_DATA: UserDashboardProps = {
  user: {
    name: "Arjun Sharma",
    email: "arjun.sharma@gmail.com",
    dietType: "Non-veg",
  },
  tasteVector: {
    spice: 8,
    sweetness: 4,
    richness: 7,
    sourness: 5,
    bitterness: 3,
  },
  tasteHistory: [
    {
      id: "1",
      dishName: "Chicken Biryani",
      action: "ordered",
      timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(),
      cuisine: "Mughlai",
    },
    {
      id: "2",
      dishName: "Dal Makhani",
      action: "loved",
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      cuisine: "North Indian",
    },
    {
      id: "3",
      dishName: "Masala Dosa",
      action: "loved",
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      cuisine: "South Indian",
    },
    {
      id: "4",
      dishName: "Paneer Tikka",
      action: "disliked",
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      cuisine: "North Indian",
    },
    {
      id: "5",
      dishName: "Pav Bhaji",
      action: "ordered",
      timestamp: new Date(Date.now() - 30 * 3600000).toISOString(),
      cuisine: "Street Food",
    },
    {
      id: "6",
      dishName: "Butter Chicken",
      action: "loved",
      timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
      cuisine: "North Indian",
    },
    {
      id: "7",
      dishName: "Chole Bhature",
      action: "ordered",
      timestamp: new Date(Date.now() - 72 * 3600000).toISOString(),
      cuisine: "North Indian",
    },
    {
      id: "8",
      dishName: "Rasam",
      action: "disliked",
      timestamp: new Date(Date.now() - 96 * 3600000).toISOString(),
      cuisine: "South Indian",
    },
  ],
  lastDishList: [
    {
      id: "d1",
      name: "Hyderabadi Dum Biryani",
      matchPercent: 96,
      cuisine: "Mughlai",
      dietType: "non-vegetarian",
      restaurantName: "Bawarchi",
      isHealthy: false,
    },
    {
      id: "d2",
      name: "Dal Makhani",
      matchPercent: 91,
      cuisine: "North Indian",
      dietType: "vegetarian",
      restaurantName: "Punjabi Dhaba",
      isHealthy: true,
    },
    {
      id: "d3",
      name: "Chicken Tikka Masala",
      matchPercent: 89,
      cuisine: "North Indian",
      dietType: "non-vegetarian",
      restaurantName: "Spice Garden",
      isHealthy: false,
    },
    {
      id: "d4",
      name: "Masala Dosa",
      matchPercent: 85,
      cuisine: "South Indian",
      dietType: "vegetarian",
      restaurantName: "MTR",
      isHealthy: true,
    },
    {
      id: "d5",
      name: "Keema Pav",
      matchPercent: 83,
      cuisine: "Street Food",
      dietType: "non-vegetarian",
      restaurantName: "Bademiya",
      isHealthy: false,
    },
    {
      id: "d6",
      name: "Pav Bhaji",
      matchPercent: 79,
      cuisine: "Street Food",
      dietType: "vegetarian",
      restaurantName: "Cannon Pav",
      isHealthy: false,
    },
    {
      id: "d7",
      name: "Idli Sambar",
      matchPercent: 77,
      cuisine: "South Indian",
      dietType: "vegetarian",
      restaurantName: "Saravana Bhavan",
      isHealthy: true,
    },
    {
      id: "d8",
      name: "Nihari",
      matchPercent: 74,
      cuisine: "Mughlai",
      dietType: "non-vegetarian",
      restaurantName: "Karim's",
      isHealthy: false,
    },
  ],
  onNavigateToFeed: (_mood) => {},
  onNavigateToFullProfile: () => {},
  onNavigateToOrders: () => {},
  onEditProfile: () => {},
  onMyPreferences: () => {},
  onLogout: () => {},
};

// ──────────────────────────────────────────────
// Helper utilities
// ──────────────────────────────────────────────

function getGreeting(name: string): { greeting: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12)
    return { greeting: `Good morning, ${name.split(" ")[0]}`, emoji: "☀️" };
  if (hour < 17)
    return { greeting: `Good afternoon, ${name.split(" ")[0]}`, emoji: "🌤️" };
  return { greeting: `Good evening, ${name.split(" ")[0]}`, emoji: "🌙" };
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getUserInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const ACTION_COLORS: Record<TasteHistoryItem["action"], string> = {
  loved: "bg-green-500",
  disliked: "bg-red-400",
  ordered: "bg-blue-500",
};

const ACTION_LABELS: Record<TasteHistoryItem["action"], string> = {
  loved: "Loved",
  disliked: "Skipped",
  ordered: "Ordered",
};

const ACTION_BADGE_STYLES: Record<TasteHistoryItem["action"], string> = {
  loved: "bg-green-50 text-green-700 border-green-200",
  disliked: "bg-red-50 text-red-600 border-red-200",
  ordered: "bg-blue-50 text-blue-700 border-blue-200",
};

const MOODS = [
  { label: "Spicy", emoji: "🌶️" },
  { label: "Light & Healthy", emoji: "🥗" },
  { label: "Comfort Food", emoji: "😌" },
  { label: "Quick Bite", emoji: "⚡" },
  { label: "Something Sweet", emoji: "🍬" },
];

// ──────────────────────────────────────────────
// Section heading helper
// ──────────────────────────────────────────────

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  action?: { label: string; onClick: () => void };
}

function SectionHeading({ icon, title, action }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h2 className="font-playfair text-lg font-semibold text-foreground">
          {title}
        </h2>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {action.label} →
        </button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────

export default function UserDashboard({
  user = MOCK_USER_DASHBOARD_DATA.user,
  tasteVector = MOCK_USER_DASHBOARD_DATA.tasteVector,
  tasteHistory = MOCK_USER_DASHBOARD_DATA.tasteHistory,
  lastDishList = MOCK_USER_DASHBOARD_DATA.lastDishList,
  onNavigateToFeed = MOCK_USER_DASHBOARD_DATA.onNavigateToFeed,
  onNavigateToFullProfile = MOCK_USER_DASHBOARD_DATA.onNavigateToFullProfile,
  onNavigateToOrders = MOCK_USER_DASHBOARD_DATA.onNavigateToOrders,
  onEditProfile = MOCK_USER_DASHBOARD_DATA.onEditProfile,
  onMyPreferences = MOCK_USER_DASHBOARD_DATA.onMyPreferences,
  onLogout = MOCK_USER_DASHBOARD_DATA.onLogout,
}: Partial<UserDashboardProps>) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [lovedDishes, setLovedDishes] = useState<Set<string>>(new Set());

  const { greeting, emoji } = getGreeting(user.name);

  const radarData = [
    { axis: "Spice", value: tasteVector.spice },
    { axis: "Sweet", value: tasteVector.sweetness },
    { axis: "Rich", value: tasteVector.richness },
    { axis: "Sour", value: tasteVector.sourness },
    { axis: "Bitter", value: tasteVector.bitterness },
  ];

  const tasteBarItems = [
    { label: "Spice", value: tasteVector.spice, color: "bg-orange-500" },
    { label: "Sweetness", value: tasteVector.sweetness, color: "bg-pink-400" },
    { label: "Richness", value: tasteVector.richness, color: "bg-amber-500" },
    { label: "Sourness", value: tasteVector.sourness, color: "bg-lime-500" },
    {
      label: "Bitterness",
      value: tasteVector.bitterness,
      color: "bg-slate-500",
    },
  ];

  const toggleLoved = (dishId: string) => {
    setLovedDishes((prev) => {
      const next = new Set(prev);
      if (next.has(dishId)) next.delete(dishId);
      else next.add(dishId);
      return next;
    });
  };

  const dietBadgeColor =
    user.dietType === "Veg" || user.dietType === "Vegan"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-orange-100 text-orange-700 border-orange-200";

  return (
    <div
      className="min-h-screen px-4 md:px-6 py-6 max-w-5xl mx-auto"
      data-ocid="dashboard.page"
    >
      {/* ── 1. HEADER / GREETING ─────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{formatDate()}</p>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {emoji} {greeting}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's your personalized food world
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Avatar className="w-12 h-12 ring-2 ring-primary/30">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
                {getUserInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${dietBadgeColor}`}
          >
            {user.dietType}
          </span>
        </div>
      </div>

      {/* ── 2. WHAT DO YOU WANT TO EAT TODAY? ───────────── */}
      <Card
        className="mb-8 glass-card border-primary/10 shadow-sm"
        data-ocid="dashboard.mood.card"
      >
        <CardHeader className="pb-3">
          <SectionHeading
            icon={<UtensilsCrossed className="w-4.5 h-4.5" />}
            title="What do you want to eat today?"
          />
        </CardHeader>
        <CardContent className="pt-0">
          <div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
            data-ocid="dashboard.mood.list"
          >
            {MOODS.map((mood) => (
              <button
                type="button"
                key={mood.label}
                data-ocid="dashboard.mood.toggle"
                onClick={() =>
                  setSelectedMood(
                    mood.label === selectedMood ? null : mood.label,
                  )
                }
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedMood === mood.label
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-white text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>
          <Button
            data-ocid="dashboard.show_recommendations.button"
            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            onClick={() => onNavigateToFeed(selectedMood ?? undefined)}
          >
            Show Me Recommendations →
          </Button>
        </CardContent>
      </Card>

      {/* ── 3. TASTE PROFILE SUMMARY ──────────────────────── */}
      <Card
        className="mb-8 glass-card border-primary/10 shadow-sm"
        data-ocid="dashboard.taste_profile.card"
      >
        <CardHeader className="pb-2">
          <SectionHeading
            icon={<Sparkles className="w-4.5 h-4.5" />}
            title="Your Taste Profile"
            action={{
              label: "View Full Profile",
              onClick: onNavigateToFullProfile,
            }}
          />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Radar Chart */}
            <div className="w-full md:w-64 h-52 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={radarData}
                  margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
                >
                  <PolarGrid stroke="oklch(0.88 0.012 75)" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fontSize: 11, fill: "oklch(0.45 0.025 60)" }}
                  />
                  <Radar
                    name="Taste"
                    dataKey="value"
                    stroke="oklch(0.68 0.22 50)"
                    fill="oklch(0.68 0.22 50)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* Progress Bars */}
            <div className="flex-1 space-y-3 w-full">
              {tasteBarItems.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground font-medium">
                      {item.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.value}/10
                    </span>
                  </div>
                  <Progress value={item.value * 10} className="h-2 bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 4. LAST DISH LIST GENERATED ───────────────────── */}
      <div className="mb-8" data-ocid="dashboard.dish_list.section">
        <SectionHeading
          icon={<LayoutList className="w-4.5 h-4.5" />}
          title="Last Dish List Generated"
        />
        {lastDishList.length === 0 ? (
          <Card
            className="glass-card border-dashed border-border/60 text-center py-12"
            data-ocid="dashboard.dish_list.empty_state"
          >
            <CardContent>
              <Brain className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No recommendations generated yet.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => onNavigateToFeed()}
              >
                Generate Recommendations
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-3" style={{ width: "max-content" }}>
              {lastDishList.slice(0, 8).map((dish, idx) => (
                <Card
                  key={dish.id}
                  data-ocid={`dashboard.dish_list.item.${idx + 1}`}
                  className="w-44 flex-shrink-0 glass-card border-border/60 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <CardContent className="p-3">
                    {/* Diet dot + Match badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          dish.dietType === "vegetarian" ||
                          dish.dietType === "vegan"
                            ? "bg-green-500"
                            : "bg-red-400"
                        }`}
                        title={dish.dietType}
                      />
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                        {dish.matchPercent}%
                      </span>
                    </div>
                    {/* Name */}
                    <p className="font-semibold text-sm text-foreground leading-snug mb-0.5 line-clamp-2">
                      {dish.name}
                    </p>
                    {/* Cuisine */}
                    <p className="text-[11px] text-muted-foreground mb-1">
                      {dish.cuisine}
                    </p>
                    {/* Restaurant */}
                    <p className="text-[10px] text-muted-foreground/70 mb-3 truncate">
                      🏪 {dish.restaurantName}
                    </p>
                    {/* Actions */}
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        data-ocid={`dashboard.dish_list.toggle.${idx + 1}`}
                        onClick={() => toggleLoved(dish.id)}
                        className={`flex-1 flex items-center justify-center h-7 rounded-md border text-xs transition-colors ${
                          lovedDishes.has(dish.id)
                            ? "bg-red-50 border-red-200 text-red-500"
                            : "border-border hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${lovedDishes.has(dish.id) ? "fill-red-400 text-red-400" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        data-ocid={`dashboard.dish_list.button.${idx + 1}`}
                        onClick={() => onNavigateToFeed()}
                        className="flex-1 h-7 rounded-md bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors"
                      >
                        Order
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* ── 5. TASTE HISTORY ─────────────────────────────── */}
      <Card
        className="mb-8 glass-card border-primary/10 shadow-sm"
        data-ocid="dashboard.taste_history.card"
      >
        <CardHeader className="pb-2">
          <SectionHeading
            icon={<Clock className="w-4.5 h-4.5" />}
            title="Taste History"
            action={{ label: "View All", onClick: () => {} }}
          />
        </CardHeader>
        <CardContent className="pt-0">
          {tasteHistory.length === 0 ? (
            <div
              className="text-center py-8"
              data-ocid="dashboard.taste_history.empty_state"
            >
              <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                No taste history yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tasteHistory.slice(0, 8).map((item, idx) => (
                <div
                  key={item.id}
                  data-ocid={`dashboard.taste_history.item.${idx + 1}`}
                  className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0"
                >
                  {/* Dot */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ACTION_COLORS[item.action]}`}
                  />
                  {/* Dish name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.dishName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.cuisine}
                    </p>
                  </div>
                  {/* Time */}
                  <span className="text-[11px] text-muted-foreground flex-shrink-0">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                  {/* Action badge */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ACTION_BADGE_STYLES[item.action]}`}
                  >
                    {ACTION_LABELS[item.action]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 6. MY ACCOUNT ────────────────────────────────── */}
      <div className="mb-8" data-ocid="dashboard.account.section">
        <SectionHeading
          icon={<User className="w-4.5 h-4.5" />}
          title="My Account"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <AccountTile
            data-ocid="dashboard.edit_profile.button"
            icon={<Settings className="w-5 h-5" />}
            label="Edit Profile"
            color="text-orange-500"
            bg="bg-orange-50 hover:bg-orange-100"
            border="border-orange-100"
            onClick={onEditProfile}
          />
          <AccountTile
            data-ocid="dashboard.preferences.button"
            icon={<Sliders className="w-5 h-5" />}
            label="My Preferences"
            color="text-blue-500"
            bg="bg-blue-50 hover:bg-blue-100"
            border="border-blue-100"
            onClick={onMyPreferences}
          />
          <AccountTile
            data-ocid="dashboard.orders.button"
            icon={<ShoppingBag className="w-5 h-5" />}
            label="My Orders"
            color="text-green-600"
            bg="bg-green-50 hover:bg-green-100"
            border="border-green-100"
            onClick={onNavigateToOrders}
          />
          <AccountTile
            data-ocid="dashboard.logout.button"
            icon={<LogOut className="w-5 h-5" />}
            label="Logout"
            color="text-slate-500"
            bg="bg-slate-50 hover:bg-slate-100"
            border="border-slate-100"
            onClick={onLogout}
          />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// AccountTile sub-component
// ──────────────────────────────────────────────

interface AccountTileProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  border: string;
  onClick: () => void;
  "data-ocid"?: string;
}

function AccountTile({
  icon,
  label,
  color,
  bg,
  border,
  onClick,
  "data-ocid": ocid,
}: AccountTileProps) {
  return (
    <Card
      data-ocid={ocid}
      onClick={onClick}
      className={`cursor-pointer border ${border} ${bg} transition-all shadow-none hover:shadow-sm active:scale-[0.98]`}
    >
      <CardContent className="p-4 flex flex-col items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm font-semibold text-foreground text-center">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}
