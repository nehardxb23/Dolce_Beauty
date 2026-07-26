import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@workspace/replit-auth-web";
import { useListOrders } from "@workspace/api-client-react";
import { Pizza, LogOut, Star, ShoppingBag, Award, Package, ChevronRight } from "lucide-react";
import { Link } from "wouter";

type OrderItem = { name: string; price: number; quantity: number; comboName?: string | null };

function statusBadge(status: string) {
  const map: Record<string, string> = {
    confirmed: "bg-green-50 text-green-700 border-green-200",
    preparing: "bg-amber-50 text-amber-700 border-amber-200",
    delivered: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return map[status] ?? "bg-gray-50 text-gray-700 border-gray-200";
}

export default function Profile() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const { data: orders = [] } = useListOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground font-serif text-xl">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Pizza className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-4">Join the Slice Club</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Sign in to earn pizza slice points with every order, unlock exclusive rewards, and track your beauty haul.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: Award, label: "Earn Points", desc: "10 slices per $1" },
                { icon: Star, label: "Redeem Rewards", desc: "Free products" },
                { icon: ShoppingBag, label: "Order History", desc: "Track orders" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-secondary/40 rounded-2xl p-4 border border-secondary">
                  <Icon className="w-6 h-6 text-primary mb-2 mx-auto" />
                  <p className="font-bold text-sm mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-6 text-lg shadow-lg shadow-primary/20"
              onClick={login}
            >
              Sign In with Replit
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Beauty Fan";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const points = (user as { loyaltyPoints?: number })?.loyaltyPoints ?? 0;
  const tier =
    points >= 15000 ? "Diamond" :
    points >= 10000 ? "Gold" :
    points >= 5000  ? "Silver" : "Bronze";
  const tierColor =
    tier === "Diamond" ? "text-cyan-500" :
    tier === "Gold"    ? "text-yellow-600" :
    tier === "Silver"  ? "text-slate-500"  : "text-amber-700";
  const nextTierPoints =
    tier === "Bronze"  ? 5000  :
    tier === "Silver"  ? 10000 :
    tier === "Gold"    ? 15000 : null;
  const progress = nextTierPoints ? Math.min((points / nextTierPoints) * 100, 100) : 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {/* Profile header */}
        <div className="bg-secondary py-16 md:py-24 border-b border-white">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4 border-4 border-white">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                initials
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-1">{displayName}</h1>
            {user?.email && <p className="text-muted-foreground mb-3">{user.email}</p>}
            <span className={`font-bold text-sm uppercase tracking-wider ${tierColor}`}>
              ★ {tier} Member
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
          {/* Loyalty points card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-secondary">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold">Your Pizza Slices</h2>
              <Pizza className="w-8 h-8 text-primary" />
            </div>
            <div className="text-6xl font-bold text-primary mb-2">{points.toLocaleString()}</div>
            <p className="text-muted-foreground mb-6">slices earned</p>

            {nextTierPoints ? (
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>{tier}</span>
                  <span>
                    {nextTierPoints - points} more slices to{" "}
                    {tier === "Bronze" ? "Silver" : tier === "Silver" ? "Gold" : "Diamond"}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-4 py-2 text-cyan-600 font-semibold text-sm">
                <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" /> You've reached Diamond status!
              </div>
            )}
          </div>

          {/* Order history */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-secondary">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold">Order History</h2>
              <Package className="w-7 h-7 text-primary" />
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-muted-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground/70 mb-4">
                  Place your first order to see it here.
                </p>
                <Link href="/shop">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white"
                  >
                    Shop Now <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const items = (order.items as OrderItem[]) ?? [];
                  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  return (
                    <div
                      key={order.id}
                      className="border border-secondary rounded-2xl p-5 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-sm">Order #{order.id}</p>
                          <p className="text-xs text-muted-foreground">{date}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusBadge(order.status)}`}
                          >
                            {order.status}
                          </span>
                          <span className="font-bold text-primary text-sm">
                            ${Number(order.total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {item.comboName ?? item.name} × {item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* How to earn */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-secondary">
            <h2 className="font-serif text-2xl font-bold mb-6">How to Earn Slices</h2>
            <div className="space-y-4">
              {[
                { action: "Complete a purchase", slices: "+10 per $1 spent", icon: ShoppingBag },
                { action: "Reach Silver tier (5,000 slices)", slices: "Unlock exclusive deals", icon: Star },
                { action: "Reach Gold tier (10,000 slices)", slices: "Free product every month", icon: Award },
                { action: "Reach Diamond tier (15,000 slices)", slices: "VIP perks & early access", icon: Award },
              ].map(({ action, slices, icon: Icon }) => (
                <div
                  key={action}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-secondary"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{action}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{slices}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <Button
              variant="outline"
              className="rounded-full px-8 border-primary/30 text-primary hover:bg-primary hover:text-white"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
