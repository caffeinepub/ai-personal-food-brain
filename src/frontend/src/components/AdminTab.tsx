import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Fingerprint,
  Loader2,
  Lock,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AppStats, Dish, UserSummary } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const CUISINES = ["north indian", "chinese", "mexican", "italian", "japanese"];
const DIET_TYPES = ["vegetarian", "non-vegetarian", "vegan"];
const PLATFORMS = ["both", "swiggy", "zomato"];
const ROLES = ["admin", "user", "guest"];

// Restaurant list matching the seeded backend data
const RESTAURANTS: { id: string; name: string; cuisine: string }[] = [
  { id: "1", name: "Tandoori Treats", cuisine: "north indian" },
  { id: "2", name: "Masala Magic", cuisine: "north indian" },
  { id: "3", name: "Wok Express", cuisine: "chinese" },
  { id: "4", name: "Dragon's Breath", cuisine: "chinese" },
  { id: "5", name: "Mexicano", cuisine: "mexican" },
  { id: "6", name: "Burrito Factory", cuisine: "mexican" },
  { id: "7", name: "Pizza Palace", cuisine: "italian" },
  { id: "8", name: "Pasta House", cuisine: "italian" },
  { id: "9", name: "Sushi Central", cuisine: "japanese" },
  { id: "10", name: "Ramen House", cuisine: "japanese" },
];

function getRestaurantName(id: string): string {
  return RESTAURANTS.find((r) => r.id === id)?.name ?? id;
}

interface DishFormState {
  name: string;
  spice: number;
  sweetness: number;
  richness: number;
  dietType: string;
  cuisine: string;
  price: number;
  restaurantId: string;
  platform: string;
}

const defaultForm: DishFormState = {
  name: "",
  spice: 0.5,
  sweetness: 0.5,
  richness: 0.5,
  dietType: "vegetarian",
  cuisine: "north indian",
  price: 200,
  restaurantId: "1",
  platform: "both",
};

function StatCard({
  icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 flex items-center gap-4"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-7 w-20 mt-1" />
        ) : (
          <p className="text-2xl font-display font-bold text-foreground">
            {value}
          </p>
        )}
      </div>
    </motion.div>
  );
}

interface AdminTabProps {
  isAdmin: boolean;
  onAdminClaimed: () => void;
}

export default function AdminTab({ isAdmin, onAdminClaimed }: AdminTabProps) {
  const { actor } = useActor();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAnonymous = !identity || identity.getPrincipal().isAnonymous();

  const [stats, setStats] = useState<AppStats | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [dishesLoading, setDishesLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [claimingAdmin, setClaimingAdmin] = useState(false);

  // Dish dialog state
  const [dishDialogOpen, setDishDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [form, setForm] = useState<DishFormState>(defaultForm);
  const [formSaving, setFormSaving] = useState(false);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDish, setDeletingDish] = useState<Dish | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Role change
  const [roleChanging, setRoleChanging] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!actor || !isAdmin) return;
    const a = actor as any;

    setStatsLoading(true);
    setDishesLoading(true);
    setUsersLoading(true);

    try {
      const [statsRes, dishesRes, usersRes] = await Promise.allSettled([
        a.adminGetAppStats(),
        a.getAllDishes(),
        a.adminGetAllUsers(),
      ]);

      setStats(statsRes.status === "fulfilled" ? statsRes.value : null);
      setDishes(
        dishesRes.status === "fulfilled" ? (dishesRes.value ?? []) : [],
      );
      setUsers(usersRes.status === "fulfilled" ? (usersRes.value ?? []) : []);
    } catch {
      // silently fail
    } finally {
      setStatsLoading(false);
      setDishesLoading(false);
      setUsersLoading(false);
    }
  }, [actor, isAdmin]);

  useEffect(() => {
    if (actor && isAdmin) {
      fetchData();
    }
  }, [fetchData, actor, isAdmin]);

  const handleClaimAdmin = async () => {
    if (!actor) return;
    if (isAnonymous) {
      toast.error("Please sign in with Internet Identity first.");
      return;
    }
    setClaimingAdmin(true);
    try {
      const a = actor as any;
      const success = await a.claimFirstAdmin();
      if (success) {
        toast.success("Admin access granted! Welcome to the control panel.");
        onAdminClaimed();
      } else {
        toast.error(
          "Admin slot already claimed. Contact an existing admin to grant you access.",
        );
      }
    } catch {
      toast.error("Failed to claim admin access. Please try again.");
    } finally {
      setClaimingAdmin(false);
    }
  };

  const openAddDish = () => {
    setEditingDish(null);
    setForm(defaultForm);
    setDishDialogOpen(true);
  };

  const openEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setForm({
      name: dish.name,
      spice: dish.spice,
      sweetness: dish.sweetness,
      richness: dish.richness,
      dietType: dish.dietType,
      cuisine: dish.cuisine,
      price: dish.price,
      restaurantId: dish.restaurantId,
      platform: dish.platform,
    });
    setDishDialogOpen(true);
  };

  const saveDish = async () => {
    if (!actor) return;
    const a = actor as any;
    if (!form.name.trim()) {
      toast.error("Dish name is required");
      return;
    }
    setFormSaving(true);
    try {
      const defaultPopularity = 0.75;
      if (editingDish) {
        await a.adminUpdateDish(
          editingDish.id,
          form.name,
          form.spice,
          form.sweetness,
          form.richness,
          form.dietType,
          form.cuisine,
          form.price,
          defaultPopularity,
          form.restaurantId,
          form.platform,
        );
        toast.success(`"${form.name}" updated successfully`);
      } else {
        await a.adminAddDish(
          form.name,
          form.spice,
          form.sweetness,
          form.richness,
          form.dietType,
          form.cuisine,
          form.price,
          defaultPopularity,
          form.restaurantId,
          form.platform,
        );
        toast.success(`"${form.name}" added successfully`);
      }
      setDishDialogOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to save dish. Please try again.");
    } finally {
      setFormSaving(false);
    }
  };

  const confirmDelete = (dish: Dish) => {
    setDeletingDish(dish);
    setDeleteDialogOpen(true);
  };

  const deleteDish = async () => {
    if (!actor || !deletingDish) return;
    const a = actor as any;
    setDeleting(true);
    try {
      await a.adminDeleteDish(deletingDish.id);
      toast.success(`"${deletingDish.name}" deleted`);
      setDeleteDialogOpen(false);
      setDeletingDish(null);
      fetchData();
    } catch {
      toast.error("Failed to delete dish");
    } finally {
      setDeleting(false);
    }
  };

  const changeUserRole = async (principalStr: string, newRole: string) => {
    if (!actor) return;
    const a = actor as any;
    setRoleChanging(principalStr);
    try {
      const principal = Principal.fromText(principalStr);
      await a.adminSetUserRole(principal, newRole);
      toast.success("User role updated");
      setUsers((prev) =>
        prev.map((u) =>
          u.principal.toString() === principalStr ? { ...u, role: newRole } : u,
        ),
      );
    } catch {
      toast.error("Failed to update user role");
    } finally {
      setRoleChanging(null);
    }
  };

  const dietBadgeColor: Record<string, string> = {
    vegetarian: "bg-emerald-50 text-emerald-700 border-emerald-200",
    vegan: "bg-green-50 text-green-700 border-green-200",
    "non-vegetarian": "bg-rose-50 text-rose-700 border-rose-200",
  };

  const platformBadgeColor: Record<string, string> = {
    both: "bg-violet-50 text-violet-700 border-violet-200",
    swiggy: "bg-orange-50 text-orange-700 border-orange-200",
    zomato: "bg-red-50 text-red-700 border-red-200",
  };

  const roleBadgeColor: Record<string, string> = {
    admin: "bg-amber-50 text-amber-700 border-amber-200",
    user: "bg-blue-50 text-blue-700 border-blue-200",
    guest: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  // Non-admin locked view
  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-sm text-muted-foreground">
            You need admin privileges to access the control panel. Follow the
            two steps below to claim the admin slot.
          </p>
        </div>

        {/* Two-step claim flow */}
        <div className="w-full max-w-sm space-y-4">
          {/* Step 1: Sign in */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              {isAnonymous ? (
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </span>
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              <p className="text-sm font-semibold text-foreground">
                {isAnonymous
                  ? "Step 1: Sign in with Internet Identity"
                  : "Signed in — ready to claim"}
              </p>
            </div>

            {isAnonymous ? (
              <>
                <Button
                  data-ocid="admin.sign_in_button"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="w-full bg-sky-100 text-sky-700 hover:bg-sky-200 border border-sky-200 gap-2"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      Sign in with Internet Identity
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  After signing in, click Make Me Admin to claim the admin slot.
                </p>
              </>
            ) : (
              <p className="text-xs text-emerald-600">
                ✓ You are signed in. Proceed to step 2.
              </p>
            )}
          </div>

          {/* Step 2: Claim admin */}
          <div
            className={`glass-card rounded-2xl p-5 space-y-3 transition-opacity ${
              isAnonymous ? "opacity-40 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </span>
              <p className="text-sm font-semibold text-foreground">
                Step 2: Claim Admin Access
              </p>
            </div>
            <Button
              data-ocid="admin.claim_admin_button"
              onClick={handleClaimAdmin}
              disabled={claimingAdmin || isAnonymous}
              className="w-full bg-amber-100 text-amber-700 hover:bg-amber-500/30 border border-amber-500/30 gap-2"
            >
              {claimingAdmin ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4" />
                  Make Me Admin
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This button only works if no admin has been assigned yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <ChefHat className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Admin Control Panel
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage dishes, users, and app data
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <section data-ocid="admin.stats.panel">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          App Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-sky-600" />}
            label="Total Users"
            value={stats ? stats.totalUsers.toString() : "0"}
            color="bg-sky-50"
            loading={statsLoading}
          />
          <StatCard
            icon={<Package className="w-5 h-5 text-violet-600" />}
            label="Interactions"
            value={stats ? stats.totalInteractions.toString() : "0"}
            color="bg-violet-50"
            loading={statsLoading}
          />
          <StatCard
            icon={<ShoppingCart className="w-5 h-5 text-amber-600" />}
            label="Total Orders"
            value={stats ? stats.totalOrders.toString() : "0"}
            color="bg-amber-50"
            loading={statsLoading}
          />
          <StatCard
            icon={<ChefHat className="w-5 h-5 text-emerald-600" />}
            label="Total Dishes"
            value={stats ? stats.totalDishes.toString() : "0"}
            color="bg-emerald-50"
            loading={statsLoading}
          />
        </div>
      </section>

      {/* Dish Management */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Dish Management
          </h2>
          <Button
            size="sm"
            data-ocid="admin.add_dish_button"
            onClick={openAddDish}
            className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Dish
          </Button>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          {dishesLoading ? (
            <div
              className="p-6 space-y-3"
              data-ocid="admin.dishes.loading_state"
            >
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : dishes.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="admin.dishes.empty_state"
            >
              <ChefHat className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No dishes found. Add one to get started.
              </p>
            </div>
          ) : (
            <Table data-ocid="admin.dish.table">
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Name
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Cuisine
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Diet
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Price
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide w-32">
                    Spice
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Restaurant
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Platform
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dishes.map((dish, idx) => (
                  <TableRow
                    key={dish.id}
                    data-ocid={`admin.dish.row.${idx + 1}`}
                    className="border-border/30 hover:bg-primary/5 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground text-sm">
                      {dish.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm capitalize">
                      {dish.cuisine}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${dietBadgeColor[dish.dietType] ?? ""}`}
                      >
                        {dish.dietType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      ₹{dish.price}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={dish.spice * 100}
                          className="h-1.5 w-20 bg-border/40"
                        />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(dish.spice * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {getRestaurantName(dish.restaurantId)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${platformBadgeColor[dish.platform] ?? ""}`}
                      >
                        {dish.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-ocid={`admin.dish.edit_button.${idx + 1}`}
                          onClick={() => openEditDish(dish)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-ocid={`admin.dish.delete_button.${idx + 1}`}
                          onClick={() => confirmDelete(dish)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* User Management */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          User Management
        </h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          {usersLoading ? (
            <div
              className="p-6 space-y-3"
              data-ocid="admin.users.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="admin.users.empty_state"
            >
              <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No users found.</p>
            </div>
          ) : (
            <Table data-ocid="admin.users.table">
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Name
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Principal
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Role
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Orders
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Joined
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    Change Role
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, idx) => {
                  const principalStr = user.principal.toString();
                  const shortPrincipal = `${principalStr.slice(0, 8)}...${principalStr.slice(-6)}`;
                  const joinedDate = new Date(
                    Number(user.createdAt / BigInt(1_000_000)),
                  ).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <TableRow
                      key={principalStr}
                      data-ocid={`admin.user.row.${idx + 1}`}
                      className="border-border/30 hover:bg-primary/5 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground text-sm">
                        {user.name || "Anonymous"}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground bg-border/20 px-2 py-0.5 rounded font-mono">
                          {shortPrincipal}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${roleBadgeColor[user.role] ?? ""}`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {user.totalOrders.toString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {joinedDate}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(val) =>
                            changeUserRole(principalStr, val)
                          }
                          disabled={roleChanging === principalStr}
                        >
                          <SelectTrigger
                            data-ocid={`admin.user.role.select.${idx + 1}`}
                            className="h-7 w-28 text-xs bg-background/40 border-border/40"
                          >
                            {roleChanging === principalStr ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => (
                              <SelectItem key={r} value={r} className="text-xs">
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* Add/Edit Dish Dialog */}
      <Dialog open={dishDialogOpen} onOpenChange={setDishDialogOpen}>
        <DialogContent
          data-ocid="admin.dish_form.dialog"
          className="glass-card border-border/50 max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editingDish ? "Edit Dish" : "Add New Dish"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Dish Name
              </Label>
              <Input
                data-ocid="admin.dish_form.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Paneer Butter Masala"
                className="bg-background/40 border-border/40 focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Cuisine
                </Label>
                <Select
                  value={form.cuisine}
                  onValueChange={(v) => setForm((p) => ({ ...p, cuisine: v }))}
                >
                  <SelectTrigger className="bg-background/40 border-border/40 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CUISINES.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Diet Type
                </Label>
                <Select
                  value={form.dietType}
                  onValueChange={(v) => setForm((p) => ({ ...p, dietType: v }))}
                >
                  <SelectTrigger className="bg-background/40 border-border/40 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIET_TYPES.map((d) => (
                      <SelectItem key={d} value={d} className="capitalize">
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Price (₹)
                </Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      price: Number(e.target.value),
                    }))
                  }
                  className="bg-background/40 border-border/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Platform
                </Label>
                <Select
                  value={form.platform}
                  onValueChange={(v) => setForm((p) => ({ ...p, platform: v }))}
                >
                  <SelectTrigger className="bg-background/40 border-border/40 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p} className="capitalize">
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Restaurant dropdown */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Restaurant
              </Label>
              <Select
                value={form.restaurantId}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, restaurantId: v }))
                }
              >
                <SelectTrigger
                  data-ocid="admin.dish_form.select"
                  className="bg-background/40 border-border/40 text-sm"
                >
                  <SelectValue placeholder="Select a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {RESTAURANTS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                      <span className="ml-1 text-xs text-muted-foreground capitalize">
                        ({r.cuisine})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sliders */}
            <div className="space-y-5 rounded-xl bg-border/10 p-4">
              <SliderField
                label="Spice Level"
                value={form.spice}
                onChange={(v) => setForm((p) => ({ ...p, spice: v }))}
                color="text-orange-400"
              />
              <SliderField
                label="Sweetness"
                value={form.sweetness}
                onChange={(v) => setForm((p) => ({ ...p, sweetness: v }))}
                color="text-pink-400"
              />
              <SliderField
                label="Richness"
                value={form.richness}
                onChange={(v) => setForm((p) => ({ ...p, richness: v }))}
                color="text-amber-600"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              data-ocid="admin.dish_form.cancel_button"
              onClick={() => setDishDialogOpen(false)}
              disabled={formSaving}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.dish_form.submit_button"
              onClick={saveDish}
              disabled={formSaving}
              className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
            >
              {formSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingDish ? (
                "Update Dish"
              ) : (
                "Add Dish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass-card border-border/50 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Dish
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="text-foreground font-medium">
              &ldquo;{deletingDish?.name}&rdquo;
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              data-ocid="admin.delete.cancel_button"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.delete.confirm_button"
              onClick={deleteDish}
              disabled={deleting}
              className="bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label
          className={`text-xs font-semibold uppercase tracking-wide ${color}`}
        >
          {label}
        </Label>
        <span className="text-xs text-muted-foreground">
          {Math.round(value * 100)}%
        </span>
      </div>
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
    </div>
  );
}
