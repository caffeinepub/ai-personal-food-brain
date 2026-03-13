import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type CuisineAffinity = {
    cuisine : Text;
    score : Float;
  };

  type TasteVector = {
    spice : Float;
    sweetness : Float;
    richness : Float;
    vegetarian : Float;
    cuisineAffinities : [CuisineAffinity];
  };

  type UserProfile = {
    name : Text;
    tasteVector : TasteVector;
    createdAt : Time.Time;
  };

  type Dish = {
    id : Text;
    name : Text;
    spice : Float;
    sweetness : Float;
    richness : Float;
    dietType : Text;
    cuisine : Text;
    price : Float;
    popularity : Float;
    restaurantId : Text;
    platform : Text; // "swiggy", "zomato", or "both"
  };

  type Restaurant = {
    id : Text;
    name : Text;
    cuisine : Text;
    deliveryTime : Float;
    rating : Float;
  };

  type FeedbackRecord = {
    dishId : Text;
    action : Text;
    rating : Float;
    timestamp : Time.Time;
  };

  type MacrosOrderLog = {
    orders : [DeliveryOrder];
    totalCalories : Float;
    avgFat : Float;
    avgProtein : Float;
    avgCarbs : Float;
    dailyBreakdown : [DayBreakdown];
  };

  type DayBreakdown = {
    dayTimestamp : Time.Time;
    calories : Float;
    fat : Float;
    protein : Float;
    carbs : Float;
    orders : [DeliveryOrder];
  };

  public type DeliveryOrder = {
    id : Text;
    dishId : Text;
    dishName : Text;
    platform : Text; // "swiggy" or "zomato"
    status : Text; // "placed"/"preparing"/"out_for_delivery"/"delivered"
    deliveryAddress : Text;
    estimatedMinutes : Nat;
    price : Float;
    placedAt : Time.Time;
    restaurantName : Text;
    cuisine : Text;
  };

  public type OrderMacros = {
    calories : Float;
    fat : Float;
    protein : Float;
    carbs : Float;
    dishType : Text;
    timeOfDayConsumed : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    feedbackHistory : Map.Map<Principal, [FeedbackRecord]>;
    totalInteractions : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    feedbackHistory : Map.Map<Principal, [FeedbackRecord]>;
    orderHistory : Map.Map<Principal, [DeliveryOrder]>;
    totalInteractions : Nat;
    persistentDishes : Map.Map<Text, Dish>;
    persistentRestaurants : Map.Map<Text, Restaurant>;
    nextOrderId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let persistentDishes = Map.fromIter<Text, Dish>([].values());
    let persistentRestaurants = Map.fromIter<Text, Restaurant>([].values());
    let orderHistory = Map.empty<Principal, [DeliveryOrder]>();

    {
      old with
      orderHistory;
      persistentDishes;
      persistentRestaurants;
      nextOrderId = 0;
    };
  };
};
