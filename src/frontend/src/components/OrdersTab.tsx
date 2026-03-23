import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  ChefHat,
  Clock,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { DeliveryOrder } from "../backend.d";
import { useMyOrders, useUpdateOrderStatus } from "../hooks/useQueries";

const STATUS_STEPS = [
  { key: "placed", label: "Placed", icon: <Package className="w-3.5 h-3.5" /> },
  {
    key: "preparing",
    label: "Preparing",
    icon: <ChefHat className="w-3.5 h-3.5" />,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
];

const STATUS_NEXT: Record<string, string> = {
  placed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
};

const STATUS_COLORS: Record<string, string> = {
  placed: "bg-blue-50 text-blue-700 border-blue-200",
  preparing: "bg-yellow-50 text-yellow-700 border-yellow-200",
  out_for_delivery: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
};

function StatusStepper({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_STEPS.map((step, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs flex-shrink-0 transition-all ${
                isDone
                  ? "bg-green-100 text-green-700"
                  : isActive
                    ? "bg-primary/15 text-primary ring-2 ring-primary/40"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {step.icon}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${
                  isDone ? "bg-green-300" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "Just now";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function OrderCard({ order, index }: { order: DeliveryOrder; index: number }) {
  const updateStatus = useUpdateOrderStatus();
  const nextStatus = STATUS_NEXT[order.status];

  const handleSimulate = async () => {
    if (!nextStatus) return;
    await updateStatus.mutateAsync({
      orderId: order.id,
      newStatus: nextStatus,
    });
    toast.success(`Order status updated to "${nextStatus.replace(/_/g, " ")}"`);
  };

  const isSwiggy = order.platform === "swiggy";
  const platformStyle = isSwiggy
    ? { background: "#FC8019", color: "#fff" }
    : { background: "#E23744", color: "#fff" };

  return (
    <motion.div
      data-ocid={`orders.item.${index}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-foreground text-base truncate">
              {order.dishName}
            </h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={platformStyle}
            >
              {isSwiggy ? "🛵 Swiggy" : "🍽️ Zomato"}
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            {order.restaurantName} · {order.cuisine}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-primary font-bold text-sm">
              ${order.price.toFixed(2)}
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                STATUS_COLORS[order.status] ||
                "bg-secondary text-muted-foreground border-border"
              }`}
            >
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs truncate">{order.deliveryAddress}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs">{formatTimestamp(order.placedAt)}</span>
            {order.status !== "delivered" && (
              <span className="text-xs">
                · ~{Number(order.estimatedMinutes)} min
              </span>
            )}
          </div>
        </div>
      </div>

      <StatusStepper status={order.status} />

      {nextStatus && (
        <Button
          data-ocid={`orders.simulate_button.${index}`}
          onClick={handleSimulate}
          disabled={updateStatus.isPending}
          size="sm"
          variant="ghost"
          className="mt-3 text-xs h-7 px-3 text-muted-foreground hover:text-foreground border border-border hover:border-border/80 gap-1.5"
        >
          <Truck className="w-3 h-3" />
          Simulate: {nextStatus.replace(/_/g, " ")}
        </Button>
      )}
    </motion.div>
  );
}

export default function OrdersTab() {
  const { data: orders, isLoading } = useMyOrders();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            My Orders
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Track your deliveries and build your taste history
          </p>
        </div>
        {orders && orders.length > 0 && (
          <Badge
            variant="outline"
            className="text-primary border-primary/40 bg-primary/10 text-sm px-3"
          >
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {isLoading && (
        <div className="space-y-4">
          {["sk1", "sk2", "sk3"].map((id) => (
            <Skeleton
              key={id}
              className="h-40 w-full bg-muted rounded-2xl"
              data-ocid="orders.loading_state"
            />
          ))}
        </div>
      )}

      {!isLoading && (!orders || orders.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="orders.empty_state"
          className="glass-card rounded-2xl p-14 text-center"
        >
          <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No orders yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Head to the <span className="text-primary font-medium">Feed</span>{" "}
            tab, find something you like, and hit Order to get started.
          </p>
        </motion.div>
      )}

      {!isLoading && orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <OrderCard key={order.id} order={order} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
