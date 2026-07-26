import { useSearch } from "wouter";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, Star, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderNum = params.get("order") ?? "000000";
  const firstName = params.get("name") ?? "there";

  const steps = [
    { icon: CheckCircle2, label: "Order Confirmed", done: true },
    { icon: Package, label: "Being Prepared", done: true },
    { icon: Truck, label: "Out for Delivery", done: false },
    { icon: Star, label: "Delivered!", done: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-16 max-w-2xl text-center">
        {/* Success icon */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-500">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          Order Placed! 🍕
        </h1>
        <p className="text-muted-foreground text-lg mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Thank you, {firstName}! Your beauty order is in the oven.
        </p>
        <div className="inline-block bg-secondary rounded-full px-5 py-2 text-sm font-bold tracking-widest mb-10 animate-in fade-in duration-700">
          Order #{orderNum}
        </div>

        {/* Delivery tracker */}
        <div className="bg-white rounded-3xl border border-secondary shadow-sm p-8 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h2 className="font-serif text-xl font-bold mb-8">Delivery Status</h2>
          <div className="flex items-start justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-secondary mx-10" />
            <div className="absolute top-5 left-0 h-0.5 bg-primary mx-10" style={{ width: "38%" }} />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.done
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-secondary text-muted-foreground"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-semibold text-center leading-tight ${step.done ? "text-primary" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-muted-foreground text-sm mt-8">
            Estimated delivery: <span className="font-bold text-foreground">10–15 minutes</span>
          </p>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white rounded-2xl border border-secondary p-5 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Confirmation sent to</p>
            <p className="font-semibold">Check your email inbox</p>
          </div>
          <div className="bg-white rounded-2xl border border-secondary p-5 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Need help?</p>
            <p className="font-semibold">support@dominosbeauty.com</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700">
          <Link href="/shop">
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90">
              Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
