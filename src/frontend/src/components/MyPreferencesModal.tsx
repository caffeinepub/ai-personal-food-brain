import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateOrUpdateProfile,
  useTasteVector,
  useUserProfile,
} from "../hooks/useQueries";

interface MyPreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MyPreferencesModal({
  open,
  onOpenChange,
}: MyPreferencesModalProps) {
  const { data: tasteVector } = useTasteVector();
  const { data: profile } = useUserProfile();
  const createProfile = useCreateOrUpdateProfile();

  const [spice, setSpice] = useState(0.5);
  const [sweet, setSweet] = useState(0.4);
  const [rich, setRich] = useState(0.6);

  useEffect(() => {
    if (open && tasteVector) {
      setSpice(tasteVector.spice);
      setSweet(tasteVector.sweetness);
      setRich(tasteVector.richness);
    }
  }, [open, tasteVector]);

  const handleSave = async () => {
    await createProfile.mutateAsync({
      username: profile?.name ?? "User",
      spice,
      sweet,
      rich,
    });
    toast.success("Preferences saved!", {
      description: "Your AI is re-calibrating...",
    });
    onOpenChange(false);
  };

  const sliders = [
    {
      id: "prefs-spice",
      ocid: "preferences.spice_input",
      emoji: "🌶️",
      label: "Spice",
      value: spice,
      onChange: setSpice,
    },
    {
      id: "prefs-sweet",
      ocid: "preferences.sweet_input",
      emoji: "🍯",
      label: "Sweetness",
      value: sweet,
      onChange: setSweet,
    },
    {
      id: "prefs-rich",
      ocid: "preferences.rich_input",
      emoji: "🧈",
      label: "Richness",
      value: rich,
      onChange: setRich,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/60 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Sliders className="w-5 h-5 text-primary" />
            My Preferences
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Adjust your taste preferences. The AI will adapt from your behavior
            too.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {sliders.map(({ id, ocid, emoji, label, value, onChange }) => (
            <div key={id} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor={id}
                  className="text-sm text-foreground flex items-center gap-2"
                >
                  <span>{emoji}</span> {label}
                </Label>
                <span className="text-primary text-sm font-bold">
                  {Math.round(value * 100)}%
                </span>
              </div>
              <Slider
                id={id}
                data-ocid={ocid}
                value={[value]}
                onValueChange={([v]) => onChange(v)}
                min={0}
                max={1}
                step={0.05}
              />
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            data-ocid="preferences.save_button"
            onClick={handleSave}
            disabled={createProfile.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
          >
            {createProfile.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
