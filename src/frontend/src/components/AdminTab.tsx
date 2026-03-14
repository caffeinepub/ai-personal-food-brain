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
  ChefHat,
  Loader2,
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

const CUISINES = ["north indian", "chinese", "mexican", "italian", "japanese"];
const DIET_TYPES = ["vegetarian", "non-vegetarian", "vegan"];
const PLATFORMS = ["both", "swiggy", "zomato"];
const ROLES = ["admin", "user", "guest"];

interface DishFormState {
  name: string;
  spice: number;
  sweetness: number;
  richness: number;
  dietType: string;
  cuisine: string;
  price: number;
  popularity: number;
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
  popularity: 0.7,
  restaurantId: "rest-001",
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

export default function AdminTab() {
  const { actor, isFetching } = useActor();
  const [stats, setStats] = useState<AppStats | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [dishesLoading, setDishesLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

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
    if (!actor || isFetching) return;
    const a = actor as any;

    setStatsLoading(true);
    setDishesLoading(true);
    setUsersLoading(true);

    const [statsRes, dishesRes, usersRes] = await Promise.allSettled([
      a.adminGetAppStats().catch(() => null),
      a.getAllDishes().catch(() => []),
      a.adminGetAllUsers().catch(() => []),
    ]);

    setStats(statsRes.status === "fulfilled" ? statsRes.value : null);
    setStatsLoading(false);

    setDishes(dishesRes.status === "fulfilled" ? (dishesRes.value ?? []) : []);
    setDishesLoading(false);

    setUsers(usersRes.status === "fulfilled" ? (usersRes.value ?? []) : []);
    setUsersLoading(false);
  }, [actor, isFetching]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      popularity: dish.popularity,
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
          form.popularity,
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
          form.popularity,
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
    vegetarian: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    vegan: "bg-green-500/15 text-green-400 border-green-500/30",
    "non-vegetarian": "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };

  const platformBadgeColor: Record<string, string> = {
    both: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    swiggy: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    zomato: "bg-red-500/15 text-red-400 border-red-500/30",
  };

  const roleBadgeColor: Record<string, string> = {
    admin: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    user: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    guest: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <ChefHat className="w-5 h-5 text-amber-400" />
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
            icon={<Users className="w-5 h-5 text-sky-400" />}
            label="Total Users"
            value={stats ? stats.totalUsers.toString() : "0"}
            color="bg-sky-500/15"
            loading={statsLoading}
          />
          <StatCard
            icon={<Package className="w-5 h-5 text-violet-400" />}
            label="Interactions"
            value={stats ? stats.totalInteractions.toString() : "0"}
            color="bg-violet-500/15"
            loading={statsLoading}
          />
          <StatCard
            icon={<ShoppingCart className="w-5 h-5 text-amber-400" />}
            label="Total Orders"
            value={stats ? stats.totalOrders.toString() : "0"}
            color="bg-amber-500/15"
            loading={statsLoading}
          />
          <StatCard
            icon={<ChefHat className="w-5 h-5 text-emerald-400" />}
            label="Total Dishes"
            value={stats ? stats.totalDishes.toString() : "0"}
            color="bg-emerald-500/15"
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

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Restaurant ID
              </Label>
              <Input
                value={form.restaurantId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, restaurantId: e.target.value }))
                }
                placeholder="rest-001"
                className="bg-background/40 border-border/40"
              />
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
                color="text-amber-400"
              />
              <SliderField
                label="Popularity"
                value={form.popularity}
                onChange={(v) => setForm((p) => ({ ...p, popularity: v }))}
                color="text-sky-400"
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
