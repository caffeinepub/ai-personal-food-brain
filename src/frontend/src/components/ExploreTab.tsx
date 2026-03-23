import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Dish } from "../backend.d";
import { useAllDishes } from "../hooks/useQueries";
import DishCard from "./DishCard";
import OrderModal from "./OrderModal";

const CUISINES = [
  "All",
  "North Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Japanese",
  "Thai",
  "South Indian",
];
const DIETS = ["All", "veg", "non-veg", "vegan"];
const SPICE_LEVELS = ["All", "Mild", "Medium", "Hot"];

// Normalize backend dietType values to filter keys
function normalizeDietType(dietType: string): string {
  const d = dietType.toLowerCase().trim();
  if (d === "vegetarian" || d === "veg") return "veg";
  if (d === "non-vegetarian" || d === "non-veg" || d === "nonvegetarian")
    return "non-veg";
  if (d === "vegan") return "vegan";
  return d;
}

function getDefaultDiet(): string {
  const pref = localStorage.getItem("dietaryPref") ?? "any";
  if (pref === "veg") return "veg";
  if (pref === "vegan") return "vegan";
  return "All";
}

export default function ExploreTab() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [diet, setDiet] = useState(getDefaultDiet);
  const [spiceLevel, setSpiceLevel] = useState("All");
  const [orderDish, setOrderDish] = useState<Dish | null>(null);
  const { data: dishes, isLoading } = useAllDishes();

  const filtered = useMemo(() => {
    if (!dishes) return [];
    return dishes.filter((d) => {
      if (
        search &&
        !d.name.toLowerCase().includes(search.toLowerCase()) &&
        !d.cuisine.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      // Case-insensitive cuisine match
      if (
        cuisine !== "All" &&
        d.cuisine.toLowerCase().replace(/[_\s]+/g, " ") !==
          cuisine.toLowerCase().replace(/[_\s]+/g, " ")
      )
        return false;
      // Normalize diet type before comparing
      if (diet !== "All" && normalizeDietType(d.dietType) !== diet)
        return false;
      if (spiceLevel !== "All") {
        if (spiceLevel === "Mild" && d.spice > 0.33) return false;
        if (spiceLevel === "Medium" && (d.spice <= 0.33 || d.spice > 0.66))
          return false;
        if (spiceLevel === "Hot" && d.spice <= 0.66) return false;
      }
      return true;
    });
  }, [dishes, search, cuisine, diet, spiceLevel]);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="explore.search_input"
          placeholder="Search dishes, cuisines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 bg-card border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap" data-ocid="explore.tab">
          {CUISINES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCuisine(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                cuisine === c
                  ? "bg-primary/20 text-primary border-primary/50"
                  : "text-muted-foreground border-border hover:text-foreground hover:border-border/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2">
            <span className="text-xs text-muted-foreground self-center">
              Diet:
            </span>
            {DIETS.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setDiet(d)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  diet === d
                    ? "bg-accent/20 text-accent-foreground border-accent/40"
                    : "text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {d === "veg"
                  ? "🌿 Veg"
                  : d === "vegan"
                    ? "🥦 Vegan"
                    : d === "non-veg"
                      ? "🍖 Non-veg"
                      : d}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-xs text-muted-foreground self-center">
              Spice:
            </span>
            {SPICE_LEVELS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSpiceLevel(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  spiceLevel === s
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="text-foreground font-medium">{filtered.length}</span>{" "}
          dishes
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            "s1",
            "s2",
            "s3",
            "s4",
            "s5",
            "s6",
            "s7",
            "s8",
            "s9",
            "s10",
            "s11",
            "s12",
          ].map((id) => (
            <div key={id} className="glass-card rounded-2xl p-4 space-y-3">
              <Skeleton className="h-4 w-3/4 bg-muted" />
              <Skeleton className="h-3 w-1/2 bg-muted" />
              <Skeleton className="h-8 w-full bg-muted" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((dish, i) => (
            <DishCard
              key={dish.id}
              dish={dish}
              index={i}
              dataOcid={`explore.item.${i + 1}`}
              onLove={() => {}}
              onDislike={() => {}}
              onOrder={(d) => setOrderDish(d)}
            />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div
          data-ocid="explore.empty_state"
          className="glass-card rounded-2xl p-12 text-center"
        >
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No dishes found
          </h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your filters or search term.
          </p>
        </div>
      )}

      <OrderModal
        dish={orderDish}
        isOpen={!!orderDish}
        onClose={() => setOrderDish(null)}
      />
    </div>
  );
}
