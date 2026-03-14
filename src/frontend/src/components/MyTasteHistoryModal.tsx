import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { History, Package, ShoppingBag } from "lucide-react";
import { useOrderTasteHistory } from "../hooks/useQueries";

interface MyTasteHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MyTasteHistoryModal({
  open,
  onOpenChange,
}: MyTasteHistoryModalProps) {
  const { data: history, isLoading } = useOrderTasteHistory();
  const totalOrders = Number(history?.totalOrders ?? 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-ocid="taste_history.panel"
        side="right"
        className="glass-card border-l border-border/60 w-full sm:max-w-md overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <History className="w-5 h-5 text-primary" />
            My Taste History
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            Insights built from your order history.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : totalOrders === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center">
              <Package className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Place your first order from the Feed tab to start building your
                taste history.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-2xl p-4 bg-primary/5">
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="font-display text-3xl font-bold text-foreground mt-1">
                  {totalOrders}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4 bg-primary/5">
                <p className="text-xs text-muted-foreground">Top Cuisine</p>
                <p className="font-display text-xl font-bold text-foreground mt-1 truncate">
                  {history?.topCuisine || "—"}
                </p>
              </div>
            </div>

            {/* Spice & Richness bars */}
            <div className="glass-card rounded-2xl p-4 space-y-4">
              <h4 className="text-sm font-semibold text-foreground">
                Taste Averages
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">🌶️ Avg Spice</span>
                  <span className="text-primary font-bold">
                    {Math.round((history?.avgSpice ?? 0) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(history?.avgSpice ?? 0) * 100}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">🧈 Avg Richness</span>
                  <span className="text-primary font-bold">
                    {Math.round((history?.avgRichness ?? 0) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(history?.avgRichness ?? 0) * 100}
                  className="h-2"
                />
              </div>
            </div>

            {/* Cuisine breakdown */}
            {history?.cuisineBreakdown &&
              history.cuisineBreakdown.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    Cuisine Breakdown
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {history.cuisineBreakdown.map((item) => (
                      <span
                        key={item.cuisine}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 font-medium"
                      >
                        {item.cuisine}{" "}
                        <span className="opacity-70">
                          ×{Number(item.count)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Platforms */}
            {history?.recentPlatforms && history.recentPlatforms.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-foreground">
                    Recent Platforms
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.recentPlatforms.map((p) => (
                    <span
                      key={p}
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{
                        background: p === "swiggy" ? "#FC8019" : "#E23744",
                      }}
                    >
                      {p === "swiggy" ? "🛵 Swiggy" : "🍽️ Zomato"}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
