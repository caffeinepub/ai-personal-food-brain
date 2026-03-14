import { Button } from "@/components/ui/button";
import { Brain, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onShowInfo: () => void;
}

export default function WelcomeScreen({
  onGetStarted,
  onShowInfo,
}: WelcomeScreenProps) {
  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center gap-8 text-center"
      >
        {/* Brand */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center glow-orange"
          >
            <Brain className="w-10 h-10 text-primary" />
          </motion.div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
              AI Food Brain
            </h1>
            <p className="text-muted-foreground mt-1.5 text-base leading-relaxed">
              Your personal taste engine — learns what you love,
              <br />
              predicts what you'll crave.
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { emoji: "🧠", label: "Learns your taste" },
            { emoji: "🎯", label: "Personalized picks" },
            { emoji: "🚀", label: "Gets smarter daily" },
          ].map((f) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card rounded-2xl p-3 flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl">{f.emoji}</span>
              <span className="text-[11px] text-muted-foreground font-medium leading-tight">
                {f.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full flex flex-col items-center gap-4"
        >
          <Button
            data-ocid="welcome.get_started_button"
            onClick={onGetStarted}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base h-12 gap-2 glow-orange"
          >
            <Sparkles className="w-4 h-4" />
            Get Started
          </Button>

          <button
            type="button"
            data-ocid="welcome.info_link"
            onClick={onShowInfo}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            I already have an account
          </button>
        </motion.div>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Lock className="w-3.5 h-3.5 text-primary/60" />
          <span>
            Secured by Internet Computer Identity — no password needed
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
