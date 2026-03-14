import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Dish } from "../backend.d";
import { usePlaceOrder, useRecordFeedback } from "../hooks/useQueries";

interface OrderModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ dish, isOpen, onClose }: OrderModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [address, setAddress] = useState("");
  const placeOrder = usePlaceOrder();
  const recordFeedback = useRecordFeedback();

  if (!dish) return null;

  const hasSwiggy = dish.platform === "swiggy" || dish.platform === "both";
  const hasZomato = dish.platform === "zomato" || dish.platform === "both";

  const handleConfirm = async () => {
    if (!selectedPlatform) {
      toast.error("Please select a delivery platform");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    try {
      await placeOrder.mutateAsync({
        dishId: dish.id,
        platform: selectedPlatform,
        deliveryAddress: address.trim(),
      });
      await recordFeedback
        .mutateAsync({ dishId: dish.id, action: "order", rating: 5 })
        .catch(() => {});
      toast.success("Order placed! 🎉", {
        description: `Your ${dish.name} is being prepared. Track it in the Orders tab.`,
        duration: 4000,
      });
      setAddress("");
      setSelectedPlatform("");
      onClose();
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="glass-card border-border max-w-md"
        data-ocid="order.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Place Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Dish Info */}
          <div className="glass-card rounded-xl p-4 bg-primary/5 border border-primary/20">
            <p className="font-semibold text-foreground text-base">
              {dish.name}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {dish.restaurantId} · {dish.cuisine}
            </p>
            <p className="text-primary font-bold text-lg mt-2">
              ${dish.price.toFixed(2)}
            </p>
          </div>

          {/* Platform Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Delivery Platform
            </Label>
            <div className="flex gap-3">
              {hasSwiggy && (
                <button
                  type="button"
                  data-ocid="order.toggle"
                  onClick={() => setSelectedPlatform("swiggy")}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    selectedPlatform === "swiggy"
                      ? "border-[#FC8019] bg-[#FC8019]/15 text-[#FC8019]"
                      : "border-border text-muted-foreground hover:border-[#FC8019]/50"
                  }`}
                >
                  🛵 Swiggy
                </button>
              )}
              {hasZomato && (
                <button
                  type="button"
                  data-ocid="order.toggle"
                  onClick={() => setSelectedPlatform("zomato")}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    selectedPlatform === "zomato"
                      ? "border-[#E23744] bg-[#E23744]/15 text-[#E23744]"
                      : "border-border text-muted-foreground hover:border-[#E23744]/50"
                  }`}
                >
                  🍽️ Zomato
                </button>
              )}
            </div>
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <Label
              htmlFor="delivery-address"
              className="text-sm font-medium text-foreground flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Delivery Address
            </Label>
            <Input
              id="delivery-address"
              data-ocid="order.input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter delivery address"
              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="ghost"
              onClick={onClose}
              data-ocid="order.cancel_button"
              className="flex-1 border border-border text-muted-foreground hover:text-foreground"
              disabled={placeOrder.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              data-ocid="order.confirm_button"
              disabled={
                placeOrder.isPending || !selectedPlatform || !address.trim()
              }
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
            >
              {placeOrder.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing...
                </>
              ) : (
                "Confirm Order"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
