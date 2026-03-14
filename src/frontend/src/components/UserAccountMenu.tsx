import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  History,
  LogOut,
  Settings,
  Sliders,
  Trash2,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";
import EditProfileModal from "./EditProfileModal";
import MyPreferencesModal from "./MyPreferencesModal";
import MyTasteHistoryModal from "./MyTasteHistoryModal";

interface UserAccountMenuProps {
  profileName: string | null;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onRetakeQuiz?: () => void;
}

export default function UserAccountMenu({
  profileName,
  onLogout,
  onDeleteAccount,
  onRetakeQuiz,
}: UserAccountMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const initials = profileName
    ? profileName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("")
    : "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          data-ocid="account_menu.dropdown_menu"
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {initials}
          </div>
          <span className="text-sm text-foreground hidden sm:block max-w-[100px] truncate">
            {profileName ?? "My Account"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 glass-card border-border/60 shadow-xl"
        >
          <DropdownMenuItem
            data-ocid="account_menu.edit_profile_button"
            onClick={() => setEditOpen(true)}
            className="gap-2.5 cursor-pointer hover:bg-primary/10 hover:text-primary"
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            data-ocid="account_menu.taste_history_button"
            onClick={() => setHistoryOpen(true)}
            className="gap-2.5 cursor-pointer hover:bg-primary/10 hover:text-primary"
          >
            <History className="w-4 h-4" />
            My Taste History
          </DropdownMenuItem>

          <DropdownMenuItem
            data-ocid="account_menu.preferences_button"
            onClick={() => setPrefsOpen(true)}
            className="gap-2.5 cursor-pointer hover:bg-primary/10 hover:text-primary"
          >
            <Sliders className="w-4 h-4" />
            My Preferences
          </DropdownMenuItem>

          {onRetakeQuiz && (
            <DropdownMenuItem
              onClick={onRetakeQuiz}
              className="gap-2.5 cursor-pointer hover:bg-primary/10 hover:text-primary"
            >
              <Wand2 className="w-4 h-4" />
              Retake Taste Quiz
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="border-border/40" />

          <DropdownMenuItem
            data-ocid="account_menu.logout_button"
            onClick={onLogout}
            className="gap-2.5 cursor-pointer hover:bg-muted/60"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>

          <DropdownMenuItem
            data-ocid="account_menu.delete_account_button"
            onClick={() => setDeleteOpen(true)}
            className="gap-2.5 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} />
      <MyTasteHistoryModal open={historyOpen} onOpenChange={setHistoryOpen} />
      <MyPreferencesModal open={prefsOpen} onOpenChange={setPrefsOpen} />
      <DeleteAccountModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onDeleteAccount}
      />
    </>
  );
}
