import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Brain,
  Compass,
  LayoutDashboard,
  LayoutGrid,
  Shield,
  ShoppingBag,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import AdminTab from "./components/AdminTab";
import AnalyticsTab from "./components/AnalyticsTab";
import ExploreTab from "./components/ExploreTab";
import FeedTab from "./components/FeedTab";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import OnboardingWizard from "./components/OnboardingWizard";
import OrdersTab from "./components/OrdersTab";
import TasteProfileTab from "./components/TasteProfileTab";
import UserAccountMenu from "./components/UserAccountMenu";
import UserDashboard, {
  MOCK_USER_DASHBOARD_DATA,
} from "./components/UserDashboard";
import WelcomeScreen from "./components/WelcomeScreen";
import { useActor } from "./hooks/useActor";
import { useUserProfile } from "./hooks/useQueries";

type WelcomeView = "welcome" | "onboarding" | "forgotPassword";

export default function App() {
  const { actor, isFetching: actorLoading } = useActor();
  const {
    isLoading: profileLoading,
    isError,
    data: profile,
  } = useUserProfile();
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem("onboardingComplete") === "true",
  );
  const [welcomeView, setWelcomeView] = useState<WelcomeView>("welcome");
  const [timedOut, setTimedOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const isLoading =
    !onboardingDone &&
    (actorLoading || profileLoading) &&
    !timedOut &&
    !isError;

  useEffect(() => {
    if (!isLoading) return;
    const t = setTimeout(() => setTimedOut(true), 10000);
    return () => clearTimeout(t);
  }, [isLoading]);

  useEffect(() => {
    if (!actor || actorLoading) return;
    actor
      .isCallerAdmin()
      .then((result) => setIsAdmin(result))
      .catch(() => setIsAdmin(false));
  }, [actor, actorLoading]);

  useEffect(() => {
    const sync = () =>
      setOnboardingDone(localStorage.getItem("onboardingComplete") === "true");
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboardingComplete", "true");
    setOnboardingDone(true);
    setWelcomeView("welcome");
  };

  const handleLogout = () => {
    localStorage.removeItem("onboardingComplete");
    setOnboardingDone(false);
    setWelcomeView("welcome");
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("onboardingComplete");
    setOnboardingDone(false);
    setWelcomeView("welcome");
    setIsAdmin(false);
  };

  const handleRetakeQuiz = () => {
    localStorage.removeItem("onboardingComplete");
    setOnboardingDone(false);
    setWelcomeView("onboarding");
  };

  const refreshAdminStatus = () => {
    if (!actor) return;
    actor
      .isCallerAdmin()
      .then((result) => setIsAdmin(result))
      .catch(() => setIsAdmin(false));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/15 flex items-center justify-center glow-orange animate-pulse">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Initializing your Food Brain...
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/50"
                style={{
                  animation: `pulse 1s ${i * 0.2}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!onboardingDone) {
    if (welcomeView === "onboarding") {
      return <OnboardingWizard onComplete={handleOnboardingComplete} />;
    }
    if (welcomeView === "forgotPassword") {
      return <ForgotPasswordScreen onBack={() => setWelcomeView("welcome")} />;
    }
    return (
      <WelcomeScreen
        onGetStarted={() => setWelcomeView("onboarding")}
        onShowInfo={() => setWelcomeView("forgotPassword")}
      />
    );
  }

  // Admin tab is ALWAYS visible; non-admins see a locked view inside AdminTab
  const navTabs = [
    {
      value: "dashboard",
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      label: "Dashboard",
    },
    {
      value: "feed",
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
      label: "Feed",
    },
    {
      value: "explore",
      icon: <Compass className="w-3.5 h-3.5" />,
      label: "Explore",
    },
    {
      value: "orders",
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
      label: "Orders",
    },
    {
      value: "profile",
      icon: <User className="w-3.5 h-3.5" />,
      label: "Taste Profile",
    },
    {
      value: "analytics",
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      label: "Analytics",
    },
    {
      value: "admin",
      icon: <Shield className="w-3.5 h-3.5" />,
      label: "Admin",
    },
  ];

  return (
    <div className="min-h-screen mesh-bg">
      <Toaster
        theme="light"
        toastOptions={{
          classNames: {
            toast: "glass-card border-border text-foreground",
          },
        }}
      />

      <header className="sticky top-0 z-50 bg-card/95 border-b border-border backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Brain
                className="text-primary"
                style={{ width: 18, height: 18 }}
              />
            </div>
            <div>
              <span className="font-display text-base font-bold text-foreground leading-none block">
                AI Food Brain
              </span>
              <span className="text-[10px] text-muted-foreground">
                Personalized Taste Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-semibold">
                Admin
              </span>
            )}
            <UserAccountMenu
              profileName={profile?.name ?? null}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
              onRetakeQuiz={handleRetakeQuiz}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-14 z-40 bg-card/95 border-b border-border backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <TabsList className="h-auto bg-transparent gap-0 p-0 rounded-none">
                {navTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    data-ocid={`nav.${tab.value}.tab`}
                    className="flex items-center gap-1.5 px-4 h-11 rounded-none text-sm font-medium text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-primary/5 transition-all"
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs">
                      {tab.label.split(" ")[0]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent
              value="dashboard"
              forceMount
              className="mt-0 data-[state=inactive]:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <UserDashboard
                  {...MOCK_USER_DASHBOARD_DATA}
                  user={{
                    ...MOCK_USER_DASHBOARD_DATA.user,
                    name: profile?.name ?? MOCK_USER_DASHBOARD_DATA.user.name,
                  }}
                  onNavigateToFeed={(mood) => {
                    setActiveTab("feed");
                    console.log("Navigate to feed with mood:", mood);
                  }}
                  onNavigateToFullProfile={() => setActiveTab("profile")}
                  onNavigateToOrders={() => setActiveTab("orders")}
                  onEditProfile={() => {}}
                  onMyPreferences={() => {}}
                  onLogout={handleLogout}
                />
              </motion.div>
            </TabsContent>
            <TabsContent
              value="feed"
              forceMount
              className="mt-0 data-[state=inactive]:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FeedTab />
              </motion.div>
            </TabsContent>
            <TabsContent
              value="explore"
              forceMount
              className="mt-0 data-[state=inactive]:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExploreTab />
              </motion.div>
            </TabsContent>
            <TabsContent
              value="orders"
              forceMount
              className="mt-0 data-[state=inactive]:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <OrdersTab />
              </motion.div>
            </TabsContent>
            <TabsContent
              value="profile"
              forceMount
              className="mt-0 data-[state=inactive]:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TasteProfileTab />
              </motion.div>
            </TabsContent>
            <TabsContent
              value="analytics"
              forceMount
              className="mt-0 data-[state=inactive]:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyticsTab />
              </motion.div>
            </TabsContent>
            <TabsContent
              value="admin"
              forceMount
              className="mt-0 data-[state=inactive]:hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AdminTab
                  isAdmin={isAdmin}
                  onAdminClaimed={refreshAdminStatus}
                />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-8 py-6 px-4 text-center bg-card/50">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
