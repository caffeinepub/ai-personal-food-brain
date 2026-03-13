import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface TasteVector {
    sweetness: number;
    richness: number;
    cuisineAffinities: Array<CuisineAffinity>;
    spice: number;
    vegetarian: number;
}
export interface DeliveryOrder {
    id: string;
    status: string;
    deliveryAddress: string;
    platform: string;
    dishName: string;
    restaurantName: string;
    placedAt: Time;
    cuisine: string;
    dishId: string;
    price: number;
    estimatedMinutes: bigint;
}
export interface CuisineAffinity {
    score: number;
    cuisine: string;
}
export interface Dish {
    id: string;
    sweetness: number;
    richness: number;
    name: string;
    platform: string;
    restaurantId: string;
    spice: number;
    cuisine: string;
    price: number;
    dietType: string;
    popularity: number;
}
export interface UserProfile {
    tasteVector: TasteVector;
    name: string;
    createdAt: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(username: string, spicePref: number, sweetPref: number, richPref: number): Promise<void>;
    getAllDishes(): Promise<Array<Dish>>;
    getAnalytics(): Promise<{
        topCuisine: string;
        learningProgress: number;
        totalInteractions: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<DeliveryOrder>>;
    getOrderTasteHistory(): Promise<{
        topCuisine: string;
        totalOrders: bigint;
        avgSpice: number;
        cuisineBreakdown: Array<{
            count: bigint;
            cuisine: string;
        }>;
        avgRichness: number;
        recentPlatforms: Array<string>;
    }>;
    getPlatformDishes(platform: string): Promise<Array<Dish>>;
    getRecommendations(_timeOfDay: string, _weather: string): Promise<Array<Dish>>;
    getTasteVector(): Promise<TasteVector>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(dishId: string, platform: string, deliveryAddress: string): Promise<string>;
    recordFeedback(dishId: string, action: string, rating: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: string, newStatus: string): Promise<void>;
}
