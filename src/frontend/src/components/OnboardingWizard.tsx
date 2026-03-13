import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, Candy, ChevronRight, Flame, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCreateOrUpdateProfile } from "../hooks/useQueries";

const CUISINES = [
  { id: "north_indian", label: "🍛 North Indian", ocid: "onboarding.item.1" },
  { id: "chinese", label: "🥡 Chinese", ocid: "onboarding.item.2" },
  { id: "italian", label: "🍝 Italian", ocid: "onboarding.item.3" },
  { id: "mexican", label: "🌮 Mexican", ocid: "onboarding.item.4" },
  { id: "japanese", label: "🍱 Japanese", ocid: "onboarding.item.5" },
  { id: "thai", label: "🍜 Thai", ocid: "onboarding.item.6" },
];

export default function OnboardingWizard({
  onComplete,
}: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [spice, setSpice] = useState(0.5);
  const [sweet, setSweet] = useState(0.4);
  const [rich, setRich] = useState(0.6);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    "north_indian",
  ]);
  const createProfile = useCreateOrUpdateProfile();

  const toggleCuisine = (id: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleFinish = async () => {
    try {
      await createProfile.mutateAsync({ username: name, spice, sweet, rich });
    } catch (_) {
      // proceed even if backend call fails
    }
    onComplete();
  };

  const steps = [
    {
      title: "What's your name?",
      subtitle: "Your AI Food Brain will personalize everything just for you.",
      icon: <Brain className="w-8 h-8 text-primary" />,
    },
    {
      title: "How do you like your food?",
      subtitle:
        "Set your base flavor preferences. The AI will refine these as it learns.",
      icon: <Flame className="w-8 h-8 text-primary" />,
    },
    {
      title: "Pick your cuisines",
      subtitle: "Select all the cuisines you enjoy. Multi-select is fine!",
      icon: <Candy className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <div
      className="min-h-screen mesh-bg flex items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('/assets/generated/food-brain-hero-bg.dim_1600x900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card rounded-3xl p-8 w-full max-w-md"
      >
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={steps[i].title}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 mb-2">
          {steps[step].icon}
          <span className="text-xs font-medium text-primary uppercase tracking-widest">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          {steps[step].title}
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          {steps[step].subtitle}
        </p>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Input
                id="onboarding-name"
                data-ocid="onboarding.input"
                placeholder="e.g. Priya, Marco, Alex..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base bg-input border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) =>
                  e.key === "Enter" && name.trim() && setStep(1)
                }
                autoFocus
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="onboarding-spice"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <span>🌶️</span> Spice Tolerance
                  </Label>
                  <span className="text-primary font-bold text-sm">
                    {Math.round(spice * 100)}%
                  </span>
                </div>
                <Slider
                  id="onboarding-spice"
                  value={[spice]}
                  onValueChange={([v]) => setSpice(v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="onboarding-sweet"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <span>🍯</span> Sweetness Preference
                  </Label>
                  <span className="text-primary font-bold text-sm">
                    {Math.round(sweet * 100)}%
                  </span>
                </div>
                <Slider
                  id="onboarding-sweet"
                  value={[sweet]}
                  onValueChange={([v]) => setSweet(v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="onboarding-rich"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <span>🧈</span> Richness / Creaminess
                  </Label>
                  <span className="text-primary font-bold text-sm">
                    {Math.round(rich * 100)}%
                  </span>
                </div>
                <Slider
                  id="onboarding-rich"
                  value={[rich]}
                  onValueChange={([v]) => setRich(v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-3"
            >
              {CUISINES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  data-ocid={c.ocid}
                  onClick={() => toggleCuisine(c.id)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    selectedCuisines.includes(c.id)
                      ? "border-primary bg-primary/15 text-primary glow-orange"
                      : "border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 border-border text-muted-foreground hover:text-foreground"
            >
              Back
            </Button>
          )}
          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !name.trim()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              data-ocid="onboarding.submit_button"
              onClick={handleFinish}
              disabled={
                createProfile.isPending || selectedCuisines.length === 0
              }
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {createProfile.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating your brain...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Launch My Food Brain
                </span>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
