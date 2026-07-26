import { useEffect, useState } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pizza, Sparkles, ShoppingBag, Award } from "lucide-react";

const SESSION_KEY = "db_signin_prompt_shown";

export function SignInPrompt() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    // Only show once per browser session, and never to already-signed-in users
    if (!isAuthenticated && !sessionStorage.getItem(SESSION_KEY)) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [isLoading, isAuthenticated]);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  };

  const handleSignIn = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    login();
  };

  if (isLoading || isAuthenticated) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent
        className="sm:max-w-lg rounded-3xl border-0 p-0 overflow-hidden shadow-2xl"
        onInteractOutside={dismiss}
      >
        {/* Screen-reader accessibility */}
        <DialogTitle className="sr-only">Welcome to Dolce Beauty — Sign in</DialogTitle>
        <DialogDescription className="sr-only">Sign in to unlock rewards, track orders, and earn Pizza Slice points.</DialogDescription>

        {/* Header banner */}
        <div className="bg-primary px-8 pt-10 pb-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Pizza className="w-9 h-9 text-white" />
            </div>
          </div>
          <h2 className="font-serif text-3xl font-bold mb-2">Welcome to Dolce Beauty</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Sign in to unlock exclusive rewards, track your orders,<br />and earn Pizza Slice points with every purchase.
          </p>
        </div>

        {/* Perks */}
        <div className="bg-white px-8 py-6">
          <div className="grid grid-cols-3 gap-4 mb-7">
            {[
              { icon: Sparkles, label: "20% Off", desc: "Your first order" },
              { icon: Award,    label: "Earn Slices", desc: "Up to 90 per order" },
              { icon: ShoppingBag, label: "Order Tracking", desc: "See every haul" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5 bg-secondary/40 rounded-2xl py-4 px-2 border border-secondary">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Icon className="w-4.5 h-4.5 text-primary w-[18px] h-[18px]" />
                </div>
                <p className="font-bold text-sm leading-tight">{label}</p>
                <p className="text-xs text-muted-foreground leading-tight">{desc}</p>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full rounded-full h-13 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 mb-3"
            onClick={handleSignIn}
          >
            Sign In with Replit
          </Button>

          <button
            onClick={dismiss}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Continue as guest →
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
