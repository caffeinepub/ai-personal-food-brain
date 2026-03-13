import Float "mo:core/Float";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type CuisineAffinity = { cuisine : Text; score : Float };

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
    platform : Text;
  };

  type Restaurant = { id : Text; name : Text; cuisine : Text; deliveryTime : Float; rating : Float };

  type FeedbackRecord = { dishId : Text; action : Text; rating : Float; timestamp : Time.Time };

  public type DeliveryOrder = {
    id : Text;
    dishId : Text;
    dishName : Text;
    platform : Text;
    status : Text;
    deliveryAddress : Text;
    estimatedMinutes : Nat;
    price : Float;
    placedAt : Time.Time;
    restaurantName : Text;
    cuisine : Text;
  };

  // Seeded dishes
  let allDishes : [Dish] = [
    { id="1"; name="Paneer Butter Masala"; spice=0.3; sweetness=0.2; richness=0.9; dietType="vegetarian"; cuisine="north indian"; price=200.0; popularity=0.9; restaurantId="1"; platform="both" },
    { id="2"; name="Chicken Tikka Masala"; spice=0.6; sweetness=0.1; richness=0.8; dietType="non-vegetarian"; cuisine="north indian"; price=250.0; popularity=0.8; restaurantId="2"; platform="both" },
    { id="3"; name="Dal Makhani"; spice=0.2; sweetness=0.3; richness=0.7; dietType="vegetarian"; cuisine="north indian"; price=180.0; popularity=0.85; restaurantId="1"; platform="swiggy" },
    { id="4"; name="Butter Chicken"; spice=0.5; sweetness=0.15; richness=0.8; dietType="non-vegetarian"; cuisine="north indian"; price=260.0; popularity=0.9; restaurantId="2"; platform="both" },
    { id="5"; name="Palak Paneer"; spice=0.4; sweetness=0.1; richness=0.7; dietType="vegetarian"; cuisine="north indian"; price=190.0; popularity=0.75; restaurantId="1"; platform="zomato" },
    { id="6"; name="Chili Paneer"; spice=0.7; sweetness=0.2; richness=0.6; dietType="vegetarian"; cuisine="chinese"; price=220.0; popularity=0.75; restaurantId="3"; platform="both" },
    { id="7"; name="Chicken Manchurian"; spice=0.8; sweetness=0.15; richness=0.7; dietType="non-vegetarian"; cuisine="chinese"; price=230.0; popularity=0.8; restaurantId="4"; platform="swiggy" },
    { id="8"; name="Veg Hakka Noodles"; spice=0.5; sweetness=0.1; richness=0.5; dietType="vegetarian"; cuisine="chinese"; price=160.0; popularity=0.7; restaurantId="3"; platform="both" },
    { id="9"; name="Kung Pao Tofu"; spice=0.75; sweetness=0.2; richness=0.55; dietType="vegetarian"; cuisine="chinese"; price=210.0; popularity=0.65; restaurantId="4"; platform="zomato" },
    { id="10"; name="Veg Fried Rice"; spice=0.6; sweetness=0.1; richness=0.5; dietType="vegetarian"; cuisine="chinese"; price=170.0; popularity=0.75; restaurantId="3"; platform="swiggy" },
    { id="11"; name="Veg Burrito"; spice=0.4; sweetness=0.25; richness=0.6; dietType="vegetarian"; cuisine="mexican"; price=180.0; popularity=0.65; restaurantId="5"; platform="zomato" },
    { id="12"; name="Chicken Quesadilla"; spice=0.5; sweetness=0.1; richness=0.7; dietType="non-vegetarian"; cuisine="mexican"; price=220.0; popularity=0.7; restaurantId="6"; platform="both" },
    { id="13"; name="Veg Tacos"; spice=0.6; sweetness=0.3; richness=0.5; dietType="vegetarian"; cuisine="mexican"; price=150.0; popularity=0.6; restaurantId="5"; platform="swiggy" },
    { id="14"; name="Nachos with Salsa"; spice=0.55; sweetness=0.2; richness=0.45; dietType="vegetarian"; cuisine="mexican"; price=160.0; popularity=0.62; restaurantId="5"; platform="zomato" },
    { id="15"; name="Veg Pizza"; spice=0.3; sweetness=0.15; richness=0.8; dietType="vegetarian"; cuisine="italian"; price=250.0; popularity=0.9; restaurantId="7"; platform="both" },
    { id="16"; name="Pasta Alfredo"; spice=0.2; sweetness=0.1; richness=0.9; dietType="vegetarian"; cuisine="italian"; price=200.0; popularity=0.8; restaurantId="7"; platform="both" },
    { id="17"; name="Chicken Lasagna"; spice=0.4; sweetness=0.2; richness=0.9; dietType="non-vegetarian"; cuisine="italian"; price=270.0; popularity=0.85; restaurantId="8"; platform="swiggy" },
    { id="18"; name="Margherita Pizza"; spice=0.15; sweetness=0.2; richness=0.7; dietType="vegetarian"; cuisine="italian"; price=220.0; popularity=0.88; restaurantId="7"; platform="zomato" },
    { id="19"; name="Veg Ramen"; spice=0.5; sweetness=0.1; richness=0.6; dietType="vegetarian"; cuisine="japanese"; price=230.0; popularity=0.7; restaurantId="9"; platform="both" },
    { id="20"; name="Chicken Sushi"; spice=0.3; sweetness=0.05; richness=0.5; dietType="non-vegetarian"; cuisine="japanese"; price=240.0; popularity=0.75; restaurantId="10"; platform="zomato" },
    { id="21"; name="Veg Tempura"; spice=0.4; sweetness=0.2; richness=0.7; dietType="vegetarian"; cuisine="japanese"; price=210.0; popularity=0.65; restaurantId="9"; platform="swiggy" },
    { id="22"; name="Miso Ramen"; spice=0.45; sweetness=0.15; richness=0.65; dietType="vegetarian"; cuisine="japanese"; price=245.0; popularity=0.72; restaurantId="9"; platform="both" },
    { id="23"; name="Chole Bhature"; spice=0.65; sweetness=0.1; richness=0.75; dietType="vegetarian"; cuisine="north indian"; price=150.0; popularity=0.82; restaurantId="1"; platform="swiggy" },
    { id="24"; name="Biryani"; spice=0.7; sweetness=0.1; richness=0.8; dietType="non-vegetarian"; cuisine="north indian"; price=300.0; popularity=0.95; restaurantId="2"; platform="both" },
    { id="25"; name="Veg Biryani"; spice=0.65; sweetness=0.1; richness=0.75; dietType="vegetarian"; cuisine="north indian"; price=250.0; popularity=0.88; restaurantId="1"; platform="zomato" },
    { id="26"; name="Spring Rolls"; spice=0.4; sweetness=0.15; richness=0.45; dietType="vegetarian"; cuisine="chinese"; price=140.0; popularity=0.7; restaurantId="3"; platform="both" },
    { id="27"; name="Penne Arrabbiata"; spice=0.55; sweetness=0.1; richness=0.65; dietType="vegetarian"; cuisine="italian"; price=195.0; popularity=0.76; restaurantId="8"; platform="swiggy" },
    { id="28"; name="Chicken Teriyaki"; spice=0.35; sweetness=0.45; richness=0.6; dietType="non-vegetarian"; cuisine="japanese"; price=265.0; popularity=0.78; restaurantId="10"; platform="both" },
    { id="29"; name="Aloo Paratha"; spice=0.45; sweetness=0.1; richness=0.6; dietType="vegetarian"; cuisine="north indian"; price=120.0; popularity=0.80; restaurantId="1"; platform="zomato" },
    { id="30"; name="Chicken Enchiladas"; spice=0.6; sweetness=0.2; richness=0.7; dietType="non-vegetarian"; cuisine="mexican"; price=235.0; popularity=0.68; restaurantId="6"; platform="both" },
  ];

  let allRestaurants : [Restaurant] = [
    { id="1"; name="Tandoori Treats"; cuisine="north indian"; deliveryTime=35.0; rating=4.5 },
    { id="2"; name="Masala Magic"; cuisine="north indian"; deliveryTime=45.0; rating=4.2 },
    { id="3"; name="Wok Express"; cuisine="chinese"; deliveryTime=30.0; rating=4.3 },
    { id="4"; name="Dragon's Breath"; cuisine="chinese"; deliveryTime=40.0; rating=4.0 },
    { id="5"; name="Mexicano"; cuisine="mexican"; deliveryTime=50.0; rating=4.1 },
    { id="6"; name="Burrito Factory"; cuisine="mexican"; deliveryTime=55.0; rating=4.2 },
    { id="7"; name="Pizza Palace"; cuisine="italian"; deliveryTime=45.0; rating=4.6 },
    { id="8"; name="Pasta House"; cuisine="italian"; deliveryTime=45.0; rating=4.4 },
    { id="9"; name="Sushi Central"; cuisine="japanese"; deliveryTime=60.0; rating=4.5 },
    { id="10"; name="Ramen House"; cuisine="japanese"; deliveryTime=55.0; rating=4.3 },
  ];

  // Persistent State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let feedbackHistory = Map.empty<Principal, [FeedbackRecord]>();
  let orderHistory = Map.empty<Principal, [DeliveryOrder]>();
  var totalInteractions : Nat = 0;
  var nextOrderId : Nat = 0;

  let defaultTasteVector : TasteVector = {
    spice = 0.5; sweetness = 0.5; richness = 0.5; vegetarian = 0.5;
    cuisineAffinities = [
      { cuisine="north indian"; score=0.5 },
      { cuisine="chinese"; score=0.5 },
      { cuisine="mexican"; score=0.5 },
      { cuisine="italian"; score=0.5 },
      { cuisine="japanese"; score=0.5 },
    ];
  };

  func ensureUserRegistered(caller : Principal) {
    if (not caller.isAnonymous()) {
      switch (accessControlState.userRoles.get(caller)) {
        case (null) { accessControlState.userRoles.add(caller, #user) };
        case (?_) {};
      };
    };
  };

  // ---- User Profile APIs ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) { return null };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) { return null };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    ensureUserRegistered(caller);
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createOrUpdateProfile(username : Text, spicePref : Float, sweetPref : Float, richPref : Float) : async () {
    ensureUserRegistered(caller);
    let tasteVector : TasteVector = {
      spice = spicePref; sweetness = sweetPref; richness = richPref; vegetarian = 0.5;
      cuisineAffinities = [
        { cuisine="north indian"; score=0.5 },
        { cuisine="chinese"; score=0.5 },
        { cuisine="mexican"; score=0.5 },
        { cuisine="italian"; score=0.5 },
        { cuisine="japanese"; score=0.5 },
      ];
    };
    userProfiles.add(caller, { name=username; tasteVector; createdAt=Time.now() });
  };

  public query ({ caller }) func getTasteVector() : async TasteVector {
    switch (userProfiles.get(caller)) {
      case (?p) { p.tasteVector };
      case (null) { defaultTasteVector };
    };
  };

  // ---- Dish APIs ----

  public query ({ caller }) func getAllDishes() : async [Dish] {
    ignore caller;
    allDishes;
  };

  public query ({ caller }) func getPlatformDishes(platform : Text) : async [Dish] {
    ignore caller;
    allDishes.filter(func(d) {
      d.platform == platform or d.platform == "both"
    });
  };

  // ---- Recommendations ----

  func calcScore(tv : TasteVector, dish : Dish) : Float {
    let spiceDiff = Float.abs(tv.spice - dish.spice);
    let sweetDiff = Float.abs(tv.sweetness - dish.sweetness);
    let richDiff = Float.abs(tv.richness - dish.richness);
    let cuisineScore = switch (tv.cuisineAffinities.find(func(a) { Text.equal(a.cuisine, dish.cuisine) })) {
      case (?a) { a.score };
      case (null) { 0.5 };
    };
    let score = 1.0 - (0.4 * spiceDiff + 0.2 * sweetDiff + 0.2 * richDiff + 0.2 * Float.abs(1.0 - cuisineScore));
    Float.min(100.0, score * 100.0);
  };

  public query ({ caller }) func getRecommendations(_timeOfDay : Text, _weather : Text) : async [Dish] {
    let tv = switch (userProfiles.get(caller)) {
      case (?p) { p.tasteVector };
      case (null) { defaultTasteVector };
    };
    let scored = allDishes.map(func(d) { { d with popularity = calcScore(tv, d) } });
    let sorted = scored.sort(func(a, b) { Float.compare(b.popularity, a.popularity) });
    sorted.sliceToArray(0, Int.min(10, sorted.size().toInt()));
  };

  // ---- Feedback ----

  public shared ({ caller }) func recordFeedback(dishId : Text, action : Text, rating : Float) : async () {
    ensureUserRegistered(caller);
    let dishOpt = allDishes.find(func(d) { d.id == dishId });
    switch (dishOpt) {
      case (?dish) {
        let fb : FeedbackRecord = { dishId; action; rating; timestamp=Time.now() };
        let hist = switch (feedbackHistory.get(caller)) {
          case (?h) { h }; case (null) { [] };
        };
        feedbackHistory.add(caller, hist.concat([fb]));
        totalInteractions += 1;
        switch (userProfiles.get(caller)) {
          case (?p) {
            let lr = 0.1; let alpha = 0.9;
            let updAffinities = p.tasteVector.cuisineAffinities.map(func(a) {
              if (Text.equal(a.cuisine, dish.cuisine)) { { cuisine=a.cuisine; score=alpha*a.score + lr*1.0 } }
              else { a };
            });
            userProfiles.add(caller, {
              p with tasteVector = {
                spice = alpha*p.tasteVector.spice + lr*dish.spice;
                sweetness = alpha*p.tasteVector.sweetness + lr*dish.sweetness;
                richness = alpha*p.tasteVector.richness + lr*dish.richness;
                vegetarian = p.tasteVector.vegetarian;
                cuisineAffinities = updAffinities;
              }
            });
          };
          case (null) {};
        };
      };
      case (null) { Runtime.trap("Dish not found") };
    };
  };

  // ---- Orders ----

  public shared ({ caller }) func placeOrder(dishId : Text, platform : Text, deliveryAddress : Text) : async Text {
    ensureUserRegistered(caller);
    let dishOpt = allDishes.find(func(d) { d.id == dishId });
    switch (dishOpt) {
      case (?dish) {
        if (dish.platform != "both" and dish.platform != platform) {
          Runtime.trap("Dish not available on that platform");
        };
        let restName = switch (allRestaurants.find(func(r) { r.id == dish.restaurantId })) {
          case (?r) { r.name }; case (null) { "Restaurant" };
        };
        let orderId = "ORD" # nextOrderId.toText();
        nextOrderId += 1;
        let order : DeliveryOrder = {
          id=orderId; dishId=dish.id; dishName=dish.name; platform;
          status="placed"; deliveryAddress; estimatedMinutes=30;
          price=dish.price; placedAt=Time.now(); restaurantName=restName; cuisine=dish.cuisine;
        };
        let existing = switch (orderHistory.get(caller)) {
          case (?o) { o }; case (null) { [] };
        };
        orderHistory.add(caller, existing.concat([order]));
        let fb : FeedbackRecord = { dishId; action="order"; rating=4.0; timestamp=Time.now() };
        let hist = switch (feedbackHistory.get(caller)) {
          case (?h) { h }; case (null) { [] };
        };
        feedbackHistory.add(caller, hist.concat([fb]));
        totalInteractions += 1;
        switch (userProfiles.get(caller)) {
          case (?p) {
            let lr = 0.1; let alpha = 0.9;
            let updAff = p.tasteVector.cuisineAffinities.map(func(a) {
              if (Text.equal(a.cuisine, dish.cuisine)) { { cuisine=a.cuisine; score=alpha*a.score + lr*1.0 } }
              else { a };
            });
            userProfiles.add(caller, {
              p with tasteVector = {
                spice = alpha*p.tasteVector.spice + lr*dish.spice;
                sweetness = alpha*p.tasteVector.sweetness + lr*dish.sweetness;
                richness = alpha*p.tasteVector.richness + lr*dish.richness;
                vegetarian = p.tasteVector.vegetarian;
                cuisineAffinities = updAff;
              }
            });
          };
          case (null) {};
        };
        orderId;
      };
      case (null) { Runtime.trap("Dish not found") };
    };
  };

  public query ({ caller }) func getMyOrders() : async [DeliveryOrder] {
    let orders = switch (orderHistory.get(caller)) {
      case (?o) { o }; case (null) { [] };
    };
    orders.reverse();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : Text) : async () {
    let orders = switch (orderHistory.get(caller)) {
      case (?o) { o }; case (null) { Runtime.trap("No orders") };
    };
    let updated = orders.map(func(o) {
      if (o.id == orderId) { { o with status=newStatus } } else { o };
    });
    orderHistory.add(caller, updated);
  };

  public query ({ caller }) func getOrderTasteHistory() : async {
    totalOrders : Nat; topCuisine : Text; avgSpice : Float; avgRichness : Float;
    cuisineBreakdown : [{ cuisine : Text; count : Nat }]; recentPlatforms : [Text];
  } {
    let orders = switch (orderHistory.get(caller)) {
      case (?o) { o }; case (null) { [] };
    };
    if (orders.size() == 0) {
      return { totalOrders=0; topCuisine="none"; avgSpice=0.0; avgRichness=0.0; cuisineBreakdown=[]; recentPlatforms=[] };
    };
    let cuisineMap = Map.empty<Text, Nat>();
    var totalSpice : Float = 0.0;
    var totalRichness : Float = 0.0;
    var dishCount : Nat = 0;
    for (order in orders.values()) {
      let c = switch (cuisineMap.get(order.cuisine)) {
        case (?n) { n+1 }; case (null) { 1 };
      };
      cuisineMap.add(order.cuisine, c);
      switch (allDishes.find(func(d) { d.id == order.dishId })) {
        case (?d) { totalSpice += d.spice; totalRichness += d.richness; dishCount += 1 };
        case (null) {};
      };
    };
    let breakdown = cuisineMap.entries().toArray().map(func((cuisine, count)) { { cuisine; count } });
    let topCuisine = if (breakdown.size() > 0) {
      breakdown.sort(func(a, b) { Nat.compare(b.count, a.count) })[0].cuisine
    } else { "none" };
    let n = orders.size();
    let recentStart : Nat = if (n > 5) { n - 5 } else { 0 };
    let recent = orders.sliceToArray(recentStart, n).map(func(o) { o.platform });
    {
      totalOrders=n;
      topCuisine;
      avgSpice = if (dishCount > 0) { totalSpice / dishCount.toFloat() } else { 0.0 };
      avgRichness = if (dishCount > 0) { totalRichness / dishCount.toFloat() } else { 0.0 };
      cuisineBreakdown=breakdown;
      recentPlatforms=recent;
    };
  };

  // ---- Analytics ----

  public query ({ caller }) func getAnalytics() : async { totalInteractions : Nat; learningProgress : Float; topCuisine : Text } {
    let hist = switch (feedbackHistory.get(caller)) {
      case (?h) { h }; case (null) { [] };
    };
    let lp = if (hist.size() == 0) { 0.0 } else { Float.min(1.0, hist.size().toFloat() / 20.0) };
    let topCuisine = switch (userProfiles.get(caller)) {
      case (?p) {
        let sorted = p.tasteVector.cuisineAffinities.sort(func(a, b) { Float.compare(b.score, a.score) });
        if (sorted.size() > 0) { sorted[0].cuisine } else { "none" };
      };
      case (null) { "none" };
    };
    { totalInteractions; learningProgress=lp; topCuisine };
  };
};
