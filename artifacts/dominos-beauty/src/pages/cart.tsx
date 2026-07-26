import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetCart, useRemoveFromCart, useClearCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { getProductImage } from "@/lib/imageMap";

const comboImageMap: Record<string, string> = {
  "Date Night Kit": "/src/assets/images/combo-date-night.jpeg",
  "College Quick Glam": "/src/assets/images/combo-college.jpeg",
  "Party Glow Box": "/src/assets/images/combo-party.jpeg",
};

export default function Cart() {
  const { data: cart, isLoading } = useGetCart();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleRemove = (itemId: number) => {
    removeFromCartMutation.mutate(
      { itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({ title: "Item removed" });
        }
      }
    );
  };

  const handleClearCart = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({ title: "Cart cleared" });
      }
    });
  };

  const handleCheckout = () => navigate("/checkout");

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-10 flex items-center gap-3">
          Your Order <span className="bg-primary text-white text-xl px-3 py-1 rounded-full font-sans">{cart?.itemCount || 0}</span>
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl bg-secondary" />)}
            </div>
            <Skeleton className="h-80 w-full rounded-3xl bg-secondary" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-secondary shadow-sm">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4">Your box is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your order yet. Let's fix that!
            </p>
            <Link href="/shop">
              <Button size="lg" className="rounded-full px-10">Start Ordering</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-secondary shadow-sm overflow-hidden">
                <div className="p-6 border-b border-secondary flex justify-between items-center bg-secondary/10">
                  <h3 className="font-bold uppercase tracking-wider text-sm text-muted-foreground">Order Items</h3>
                  <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-destructive hover:text-destructive hover:bg-destructive/10 -my-2 h-8">
                    Clear All
                  </Button>
                </div>
                <div className="divide-y divide-secondary">
                  {cart.items.map((item) => {
                    const isCombo = item.comboId != null;
                    const name = isCombo ? item.comboName! : item.product?.name ?? "";
                    const price = isCombo ? (item.comboPrice ?? 0) : (item.product?.price ?? 0);
                    const category = isCombo ? "Combo Kit" : item.product?.category ?? "";
                    const imgSrc = isCombo
                      ? (comboImageMap[name] || "/src/assets/images/combo-date-night.jpeg")
                      : getProductImage(name);

                    return (
                      <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 group hover:bg-secondary/5 transition-colors">
                        <div className="w-24 h-24 bg-secondary rounded-xl overflow-hidden flex-shrink-0 relative">
                          {isCombo ? (
                            <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <img src={imgSrc} alt={name} className="w-full h-full object-cover mix-blend-multiply" />
                          )}
                          {isCombo && (
                            <div className="absolute inset-0 bg-black/10 flex items-end justify-end p-1">
                              <Package className="w-4 h-4 text-white drop-shadow" />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow text-center sm:text-left">
                          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{category}</div>
                          <h4 className="font-serif text-xl font-bold mb-2">{name}</h4>
                          <div className="flex items-center justify-center sm:justify-start gap-4">
                            <span className="font-bold text-lg">${price.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="font-bold text-xl sm:w-24 sm:text-right">${(price * item.quantity).toFixed(2)}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item.id)}
                            disabled={removeFromCartMutation.isPending}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-secondary shadow-xl sticky top-28 overflow-hidden">
                <div className="p-8">
                  <h3 className="font-serif text-2xl font-bold mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-8 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({cart.itemCount} items)</span>
                      <span className="font-semibold">${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Express Delivery (10 min)</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes</span>
                      <span className="font-semibold">${(cart.total * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t border-secondary pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-3xl text-primary">${(cart.total * 1.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full rounded-full h-14 text-lg bg-foreground hover:bg-foreground/90 shadow-lg group"
                    onClick={handleCheckout}
                  >
                    Place Order
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className="bg-secondary/50 p-4 text-center text-xs text-muted-foreground font-medium">
                  Hot and fresh delivery guaranteed.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
