import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateOrUpdateProfile,
  useTasteVector,
  useUserProfile,
} from "../hooks/useQueries";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileModal({
  open,
  onOpenChange,
}: EditProfileModalProps) {
  const { data: profile } = useUserProfile();
  const { data: tasteVector } = useTasteVector();
  const createProfile = useCreateOrUpdateProfile();
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName(profile?.name ?? "");
  }, [open, profile?.name]);

  const handleSave = async () => {
    if (!name.trim()) return;
    await createProfile.mutateAsync({
      username: name.trim(),
      spice: tasteVector?.spice ?? 0.5,
      sweet: tasteVector?.sweetness ?? 0.4,
      rich: tasteVector?.richness ?? 0.6,
    });
    toast.success("Profile updated!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/60 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <User className="w-5 h-5 text-primary" />
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Update your display name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label
            htmlFor="edit-profile-name"
            className="text-sm text-foreground"
          >
            Display Name
          </Label>
          <Input
            id="edit-profile-name"
            data-ocid="edit_profile.input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-muted/40 border-border/60 focus:border-primary"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            data-ocid="edit_profile.cancel_button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            data-ocid="edit_profile.save_button"
            onClick={handleSave}
            disabled={createProfile.isPending || !name.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
          >
            {createProfile.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
