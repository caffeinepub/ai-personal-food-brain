import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Brain,
  Compass,
  LayoutGrid,
  Sparkles,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AnalyticsTab from "./components/AnalyticsTab";
import ExploreTab from "./components/ExploreTab";
import FeedTab from "./components/FeedTab";
import OnboardingWizard from "./components/OnboardingWizard";
import TasteProfileTab from "./components/TasteProfileTab";
import { useUserProfile } from "./hooks/useQueries";

export default function App() {
  const { data: profile, isLoading } = useUserProfile();
  const [onboardingDone, setOnboardingDone] = useState(false);

  const hasProfile = !!profile || onboardingDone;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center glow-orange animate-pulse">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Initializing your Food Brain...
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/60"
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

  // Onboarding
  if (!hasProfile) {
    return <OnboardingWizard onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <div className="min-h-screen mesh-bg">
      <Toaster
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "glass-card border-border text-foreground",
          },
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain
                className="w-4.5 h-4.5 text-primary"
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
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground hidden sm:block">
              Hi,{" "}
              <span className="text-foreground font-medium">
                {profile?.name ?? "Foodie"}
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto">
        <Tabs defaultValue="feed" className="w-full">
          {/* Tab nav */}
          <div className="sticky top-14 z-40 glass-card border-b border-border/40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <TabsList className="h-auto bg-transparent gap-0 p-0 rounded-none">
                {[
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
                    value: "profile",
                    icon: <User className="w-3.5 h-3.5" />,
                    label: "Taste Profile",
                  },
                  {
                    value: "analytics",
                    icon: <BarChart3 className="w-3.5 h-3.5" />,
                    label: "Analytics",
                  },
                ].map((tab) => (
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

          {/* Tab content */}
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-8 py-6 px-4 text-center">
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
