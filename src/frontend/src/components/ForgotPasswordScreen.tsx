import { Button } from "@/components/ui/button";
import { ArrowLeft, KeyRound, Shield, Smartphone } from "lucide-react";
import { motion } from "motion/react";

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export default function ForgotPasswordScreen({
  onBack,
}: ForgotPasswordScreenProps) {
  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <button
          type="button"
          data-ocid="forgot_password.back_button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                No Password Needed
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                Your AI Food Brain account uses a different kind of security.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 p-4 rounded-2xl bg-primary/8 border border-primary/20">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">
                  Cryptographic Identity
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your account is secured by Internet Computer Identity. There's
                  no password to forget — your cryptographic identity key{" "}
                  <span className="text-primary font-semibold">IS</span> your
                  account.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-2xl bg-muted/30 border border-border/40">
              <Smartphone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">
                  Lost access to your device?
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you've lost access to your identity, you can recover it
                  using your{" "}
                  <span className="text-primary font-semibold">
                    Internet Identity recovery phrase
                  </span>
                  . This was shown to you when you first created your identity.
                </p>
              </div>
            </div>
          </div>

          <Button
            data-ocid="forgot_password.back_button"
            onClick={onBack}
            variant="outline"
            className="w-full border-border/60 text-foreground hover:bg-muted/50"
          >
            Return to Welcome
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
