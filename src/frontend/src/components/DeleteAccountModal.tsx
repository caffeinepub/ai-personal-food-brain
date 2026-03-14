import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAccountModalProps) {
  const { actor } = useActor();
  const [confirmText, setConfirmText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const canConfirm = confirmText === "DELETE";

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setIsPending(true);
    try {
      if (actor) {
        await actor.saveCallerUserProfile({
          name: "",
          tasteVector: {
            spice: 0.5,
            sweetness: 0.4,
            richness: 0.6,
            vegetarian: 0.3,
            cuisineAffinities: [],
          },
          createdAt: BigInt(0),
        });
      }
    } catch (_) {
      // best-effort reset
    }
    localStorage.removeItem("onboardingComplete");
    setIsPending(false);
    setConfirmText("");
    onOpenChange(false);
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        data-ocid="delete_account.dialog"
        className="glass-card border-destructive/40 sm:max-w-md"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive font-display">
            <TriangleAlert className="w-5 h-5" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            This will{" "}
            <span className="text-destructive font-semibold">
              permanently delete
            </span>{" "}
            your taste profile and all your data. This action{" "}
            <span className="font-semibold text-foreground">
              cannot be undone
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="delete-confirm" className="text-sm text-foreground">
            Type{" "}
            <span className="text-destructive font-mono font-bold">DELETE</span>{" "}
            to confirm
          </Label>
          <Input
            id="delete-confirm"
            data-ocid="delete_account.confirm_input"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="bg-muted/40 border-destructive/40 focus:border-destructive font-mono"
          />
        </div>

        <AlertDialogFooter className="gap-2">
          <Button
            data-ocid="delete_account.cancel_button"
            variant="ghost"
            onClick={() => {
              setConfirmText("");
              onOpenChange(false);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            data-ocid="delete_account.confirm_button"
            onClick={handleConfirm}
            disabled={!canConfirm || isPending}
            variant="destructive"
            className="gap-2 font-semibold"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete My Account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
