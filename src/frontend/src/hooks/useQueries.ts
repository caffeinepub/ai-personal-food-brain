import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DeliveryOrder,
  Dish,
  TasteVector,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const timeout = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 8000),
      );
      return Promise.race([
        actor.getCallerUserProfile().catch(() => null),
        timeout,
      ]);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    retryDelay: 1000,
  });
}

export function useAllDishes() {
  const { actor, isFetching } = useActor();
  return useQuery<Dish[]>({
    queryKey: ["allDishes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDishes().catch(() => []);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlatformDishes(platform: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Dish[]>({
    queryKey: ["platformDishes", platform],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlatformDishes(platform).catch(() => []);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecommendations(timeOfDay: string, weather: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Dish[]>({
    queryKey: ["recommendations", timeOfDay, weather],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecommendations(timeOfDay, weather).catch(() => []);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTasteVector() {
  const { actor, isFetching } = useActor();
  return useQuery<TasteVector>({
    queryKey: ["tasteVector"],
    queryFn: async () => {
      if (!actor) {
        return {
          spice: 0.5,
          sweetness: 0.4,
          richness: 0.6,
          vegetarian: 0.3,
          cuisineAffinities: [],
        };
      }
      return actor.getTasteVector().catch(() => ({
        spice: 0.5,
        sweetness: 0.4,
        richness: 0.6,
        vegetarian: 0.3,
        cuisineAffinities: [],
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    topCuisine: string;
    learningProgress: number;
    totalInteractions: bigint;
  }>({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor)
        return {
          topCuisine: "North Indian",
          learningProgress: 0,
          totalInteractions: BigInt(0),
        };
      return actor.getAnalytics().catch(() => ({
        topCuisine: "North Indian",
        learningProgress: 0,
        totalInteractions: BigInt(0),
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<DeliveryOrder[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders().catch(() => []);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrderTasteHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    topCuisine: string;
    totalOrders: bigint;
    avgSpice: number;
    cuisineBreakdown: Array<{ count: bigint; cuisine: string }>;
    avgRichness: number;
    recentPlatforms: Array<string>;
  }>({
    queryKey: ["orderTasteHistory"],
    queryFn: async () => {
      if (!actor)
        return {
          topCuisine: "",
          totalOrders: BigInt(0),
          avgSpice: 0,
          cuisineBreakdown: [],
          avgRichness: 0,
          recentPlatforms: [],
        };
      return actor.getOrderTasteHistory().catch(() => ({
        topCuisine: "",
        totalOrders: BigInt(0),
        avgSpice: 0,
        cuisineBreakdown: [],
        avgRichness: 0,
        recentPlatforms: [],
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      spice,
      sweet,
      rich,
    }: { username: string; spice: number; sweet: number; rich: number }) => {
      if (!actor) throw new Error("No actor");
      return actor.createOrUpdateProfile(username, spice, sweet, rich);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["tasteVector"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}

export function useRecordFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      dishId,
      action,
      rating,
    }: { dishId: string; action: string; rating: number }) => {
      if (!actor) throw new Error("No actor");
      return actor.recordFeedback(dishId, action, rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasteVector"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      dishId,
      platform,
      deliveryAddress,
    }: { dishId: string; platform: string; deliveryAddress: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.placeOrder(dishId, platform, deliveryAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["orderTasteHistory"] });
      queryClient.invalidateQueries({ queryKey: ["tasteVector"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: { orderId: string; newStatus: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderStatus(orderId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
}
