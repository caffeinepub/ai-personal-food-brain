import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TasteVector {
    sweetness: number;
    richness: number;
    cuisineAffinities: Array<CuisineAffinity>;
    spice: number;
    vegetarian: number;
}
export type Time = bigint;
export interface CuisineAffinity {
    score: number;
    cuisine: string;
}
export interface Dish {
    id: string;
    sweetness: number;
    richness: number;
    name: string;
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
    getRecommendations(_timeOfDay: string, _weather: string): Promise<Array<Dish>>;
    getTasteVector(): Promise<TasteVector>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordFeedback(dishId: string, action: string, rating: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
