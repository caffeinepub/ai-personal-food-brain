import List "mo:core/List";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
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

  public type UserProfile = {
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

  // Local Dishes (persistent in canister code)
  module LocalDishes {
    public let dishesArray : [Dish] = [
      // North Indian dishes
      { id = "1"; name = "Paneer Butter Masala"; spice = 0.3; sweetness = 0.2; richness = 0.9; dietType = "vegetarian"; cuisine = "north indian"; price = 200.0; popularity = 0.9; restaurantId = "1" },
      { id = "2"; name = "Chicken Tikka Masala"; spice = 0.6; sweetness = 0.1; richness = 0.8; dietType = "non-vegetarian"; cuisine = "north indian"; price = 250.0; popularity = 0.8; restaurantId = "2" },
      { id = "3"; name = "Dal Makhani"; spice = 0.2; sweetness = 0.3; richness = 0.7; dietType = "vegetarian"; cuisine = "north indian"; price = 180.0; popularity = 0.85; restaurantId = "1" },

      // Chinese dishes
      { id = "4"; name = "Chili Paneer"; spice = 0.7; sweetness = 0.2; richness = 0.6; dietType = "vegetarian"; cuisine = "chinese"; price = 220.0; popularity = 0.75; restaurantId = "3" },
      { id = "5"; name = "Chicken Manchurian"; spice = 0.8; sweetness = 0.15; richness = 0.7; dietType = "non-vegetarian"; cuisine = "chinese"; price = 230.0; popularity = 0.8; restaurantId = "4" },
      { id = "6"; name = "Veg Hakka Noodles"; spice = 0.5; sweetness = 0.1; richness = 0.5; dietType = "vegetarian"; cuisine = "chinese"; price = 160.0; popularity = 0.7; restaurantId = "3" },

      // Mexican dishes
      { id = "7"; name = "Veg Burrito"; spice = 0.4; sweetness = 0.25; richness = 0.6; dietType = "vegetarian"; cuisine = "mexican"; price = 180.0; popularity = 0.65; restaurantId = "5" },
      { id = "8"; name = "Chicken Quesadilla"; spice = 0.5; sweetness = 0.1; richness = 0.7; dietType = "non-vegetarian"; cuisine = "mexican"; price = 220.0; popularity = 0.7; restaurantId = "6" },
      { id = "9"; name = "Veg Tacos"; spice = 0.6; sweetness = 0.3; richness = 0.5; dietType = "vegetarian"; cuisine = "mexican"; price = 150.0; popularity = 0.6; restaurantId = "5" },

      // Italian dishes
      { id = "10"; name = "Veg Pizza"; spice = 0.3; sweetness = 0.15; richness = 0.8; dietType = "vegetarian"; cuisine = "italian"; price = 250.0; popularity = 0.9; restaurantId = "7" },
      { id = "11"; name = "Pasta Alfredo"; spice = 0.2; sweetness = 0.1; richness = 0.9; dietType = "vegetarian"; cuisine = "italian"; price = 200.0; popularity = 0.8; restaurantId = "7" },
      { id = "12"; name = "Chicken Lasagna"; spice = 0.4; sweetness = 0.2; richness = 0.9; dietType = "non-vegetarian"; cuisine = "italian"; price = 270.0; popularity = 0.85; restaurantId = "8" },

      // Japanese dishes
      { id = "13"; name = "Veg Ramen"; spice = 0.5; sweetness = 0.1; richness = 0.6; dietType = "vegetarian"; cuisine = "japanese"; price = 230.0; popularity = 0.7; restaurantId = "9" },
      { id = "14"; name = "Chicken Sushi"; spice = 0.3; sweetness = 0.05; richness = 0.5; dietType = "non-vegetarian"; cuisine = "japanese"; price = 240.0; popularity = 0.75; restaurantId = "10" },
      { id = "15"; name = "Veg Tempura"; spice = 0.4; sweetness = 0.2; richness = 0.7; dietType = "vegetarian"; cuisine = "japanese"; price = 210.0; popularity = 0.65; restaurantId = "9" },

      // Other dishes
      { id = "16"; name = "Butter Chicken"; spice = 0.5; sweetness = 0.15; richness = 0.8; dietType = "non-vegetarian"; cuisine = "north indian"; price = 260.0; popularity = 0.9; restaurantId = "2" },
      { id = "17"; name = "Veg Fried Rice"; spice = 0.6; sweetness = 0.1; richness = 0.5; dietType = "vegetarian"; cuisine = "chinese"; price = 170.0; popularity = 0.75; restaurantId = "3" },
      { id = "18"; name = "Veg Burrito Bowl"; spice = 0.45; sweetness = 0.2; richness = 0.6; dietType = "vegetarian"; cuisine = "mexican"; price = 190.0; popularity = 0.7; restaurantId = "5" },
    ];
  };

  module LocalRestaurants {
    public let restaurantsArray : [Restaurant] = [
      { id = "1"; name = "Tandoori Treats"; cuisine = "north indian"; deliveryTime = 35.0; rating = 4.5 },
      { id = "2"; name = "Masala Magic"; cuisine = "north indian"; deliveryTime = 45.0; rating = 4.2 },
      { id = "3"; name = "Wok Express"; cuisine = "chinese"; deliveryTime = 30.0; rating = 4.3 },
      { id = "4"; name = "Dragon's Breath"; cuisine = "chinese"; deliveryTime = 40.0; rating = 4.0 },
      { id = "5"; name = "Mexicano"; cuisine = "mexican"; deliveryTime = 50.0; rating = 4.1 },
      { id = "6"; name = "Burrito Factory"; cuisine = "mexican"; deliveryTime = 55.0; rating = 4.2 },
      { id = "7"; name = "Pizza Palace"; cuisine = "italian"; deliveryTime = 45.0; rating = 4.6 },
      { id = "8"; name = "Pasta House"; cuisine = "italian"; deliveryTime = 45.0; rating = 4.4 },
      { id = "9"; name = "Sushi Central"; cuisine = "japanese"; deliveryTime = 60.0; rating = 4.5 },
      { id = "10"; name = "Ramen House"; cuisine = "japanese"; deliveryTime = 55.0; rating = 4.3 },
    ];
  };

  // Persistent State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let feedbackHistory = Map.empty<Principal, [FeedbackRecord]>();
  var totalInteractions : Nat = 0;

  // Default Taste Vector
  let defaultTasteVector : TasteVector = {
    spice = 0.5;
    sweetness = 0.5;
    richness = 0.5;
    vegetarian = 0.5;
    cuisineAffinities = [
      { cuisine = "north indian"; score = 0.5 },
      { cuisine = "chinese"; score = 0.5 },
      { cuisine = "mexican"; score = 0.5 },
      { cuisine = "italian"; score = 0.5 },
      { cuisine = "japanese"; score = 0.5 },
    ];
  };

  // Required profile management functions per instructions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Create or Update User Profile
  public shared ({ caller }) func createOrUpdateProfile(username : Text, spicePref : Float, sweetPref : Float, richPref : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };

    let tasteVector : TasteVector = {
      spice = spicePref;
      sweetness = sweetPref;
      richness = richPref;
      vegetarian = 0.5;
      cuisineAffinities = [
        { cuisine = "north indian"; score = 0.5 },
        { cuisine = "chinese"; score = 0.5 },
        { cuisine = "mexican"; score = 0.5 },
        { cuisine = "italian"; score = 0.5 },
        { cuisine = "japanese"; score = 0.5 },
      ];
    };

    let newProfile : UserProfile = {
      name = username;
      tasteVector;
      createdAt = Time.now();
    };

    userProfiles.add(caller, newProfile);
  };

  // Get Taste Vector
  public query ({ caller }) func getTasteVector() : async TasteVector {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view taste vectors");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) { profile.tasteVector };
      case (null) { defaultTasteVector };
    };
  };

  // Get All Dishes - public access (guests can browse)
  public query ({ caller }) func getAllDishes() : async [Dish] {
    LocalDishes.dishesArray;
  };

  // Calculate Match Score
  func calculateMatchScore(tasteVector : TasteVector, dish : Dish) : Float {
    let spiceDiff = Float.abs(tasteVector.spice - dish.spice);
    let sweetnessDiff = Float.abs(tasteVector.sweetness - dish.sweetness);
    let richnessDiff = Float.abs(tasteVector.richness - dish.richness);

    let cuisineAffinity = switch (
      tasteVector.cuisineAffinities.find(
        func(affinity) { Text.equal(affinity.cuisine, dish.cuisine) }
      )
    ) {
      case (?affinity) { affinity.score };
      case (null) { 0.5 };
    };

    let cuisineDiff = Float.abs(1.0 - cuisineAffinity);

    let score = 1.0 - (0.4 * spiceDiff + 0.2 * sweetnessDiff + 0.2 * richnessDiff + 0.2 * cuisineDiff);
    score * 100.0;
  };

  // Get Recommendations - requires user authentication for personalized recommendations
  public query ({ caller }) func getRecommendations(_timeOfDay : Text, _weather : Text) : async [Dish] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get personalized recommendations");
    };

    let tasteVector = switch (userProfiles.get(caller)) {
      case (?profile) { profile.tasteVector };
      case (null) { defaultTasteVector };
    };

    let dishes = LocalDishes.dishesArray;

    let scoredDishes = dishes.map(
      func(dish) {
        var matchScore = calculateMatchScore(tasteVector, dish);
        if (matchScore > 100.0) { matchScore := 100.0 };
        { dish with popularity = matchScore };
      }
    );

    func compareByPopularity(dish1 : Dish, dish2 : Dish) : Order.Order {
      Float.compare(dish2.popularity, dish1.popularity);
    };

    let sortedDishes = scoredDishes.sort(compareByPopularity);
    sortedDishes.sliceToArray(0, Int.min(10, sortedDishes.size().toInt()));
  };

  // Record Feedback - requires user authentication
  public shared ({ caller }) func recordFeedback(dishId : Text, action : Text, rating : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record feedback");
    };

    // Find the dish
    let dishOpt = LocalDishes.dishesArray.find(func(d) { d.id == dishId });
    
    switch (dishOpt) {
      case (?dish) {
        // Record feedback
        let feedback : FeedbackRecord = {
          dishId;
          action;
          rating;
          timestamp = Time.now();
        };

        let currentHistory = switch (feedbackHistory.get(caller)) {
          case (?history) { history };
          case (null) { [] };
        };

        feedbackHistory.add(caller, currentHistory.concat([feedback]));
        totalInteractions += 1;

        // Update taste vector using exponential moving average with learning rate 0.1
        switch (userProfiles.get(caller)) {
          case (?profile) {
            let learningRate = 0.1;
            let alpha = 1.0 - learningRate;

            let newSpice = alpha * profile.tasteVector.spice + learningRate * dish.spice;
            let newSweetness = alpha * profile.tasteVector.sweetness + learningRate * dish.sweetness;
            let newRichness = alpha * profile.tasteVector.richness + learningRate * dish.richness;

            // Update cuisine affinity
            let updatedAffinities = profile.tasteVector.cuisineAffinities.map(
              func(affinity) {
                if (Text.equal(affinity.cuisine, dish.cuisine)) {
                  { cuisine = affinity.cuisine; score = alpha * affinity.score + learningRate * 1.0 };
                } else {
                  affinity;
                };
              }
            );

            let updatedTasteVector : TasteVector = {
              spice = newSpice;
              sweetness = newSweetness;
              richness = newRichness;
              vegetarian = profile.tasteVector.vegetarian;
              cuisineAffinities = updatedAffinities;
            };

            let updatedProfile : UserProfile = {
              name = profile.name;
              tasteVector = updatedTasteVector;
              createdAt = profile.createdAt;
            };

            userProfiles.add(caller, updatedProfile);
          };
          case (null) {
            // No profile exists, do nothing
          };
        };
      };
      case (null) {
        Runtime.trap("Dish not found");
      };
    };
  };

  // Get Analytics - requires user authentication
  public query ({ caller }) func getAnalytics() : async { totalInteractions : Nat; learningProgress : Float; topCuisine : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };

    let userFeedback = switch (feedbackHistory.get(caller)) {
      case (?history) { history };
      case (null) { [] };
    };

    let learningProgress = if (userFeedback.size() == 0) {
      0.0;
    } else {
      Float.min(1.0, userFeedback.size().toFloat() / 20.0);
    };

    let topCuisine = switch (userProfiles.get(caller)) {
      case (?profile) {
        let sortedAffinities = profile.tasteVector.cuisineAffinities.sort(
          func(a, b) { Float.compare(b.score, a.score) }
        );
        if (sortedAffinities.size() > 0) {
          sortedAffinities[0].cuisine;
        } else {
          "none";
        };
      };
      case (null) { "none" };
    };

    {
      totalInteractions;
      learningProgress;
      topCuisine;
    };
  };
};
