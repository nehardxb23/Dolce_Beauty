import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, Sparkles } from "lucide-react";

function NewsletterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({
      title: "You're in! 🍕",
      description: `We'll send your 20% off code to ${email} shortly.`,
    });
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail("");
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md rounded-3xl border-secondary p-8">
        <DialogHeader className="text-center items-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="font-serif text-3xl font-bold">Get 20% Off</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            Enter your email and we'll send your exclusive first-order discount code right away.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🍕</div>
            <p className="font-semibold text-lg text-primary">Check your inbox!</p>
            <p className="text-sm text-muted-foreground">Your 20% off code is on its way.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl border-secondary"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-semibold"
            >
              Send My 20% Off Code
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <footer className="bg-foreground text-background">
      <NewsletterModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="w-full bg-primary py-4 px-4 text-center">
        <p className="font-serif italic text-lg sm:text-xl font-medium tracking-wide">
          Get 20% Off Your First Order!{" "}
          <span className="ml-2 inline-block">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full px-6 font-sans cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              Sign Up Now &gt;
            </Button>
          </span>
        </p>
      </div>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded transform -rotate-12 flex flex-col p-1 justify-between">
                <div className="flex justify-between">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div className="w-full h-px bg-white/50" />
                <div className="flex justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <span className="font-serif font-bold text-xl text-primary">
                Dolce <span className="font-sans text-base text-background italic ml-1">Beauty</span>
              </span>
            </div>
            <p className="text-background/60 text-sm mb-6 max-w-xs">
              Makeup delivered like pizza. Fast, fresh, and exactly what you ordered. Get ready in 10 minutes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary">Shop</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/combos" className="hover:text-primary transition-colors">Combo Kits</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary">Services</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><Link href="/ai-match" className="hover:text-primary transition-colors">AI Shade Match</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Virtual Try-On</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Track Delivery</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Gift Cards</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary">Company</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/40">
          <p>© 2025 Dolce Beauty. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
