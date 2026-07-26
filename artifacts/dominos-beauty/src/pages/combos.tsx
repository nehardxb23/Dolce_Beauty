import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListCombos, useAddComboToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const comboImageMap: Record<string, string> = {
  "Date Night Kit": "/src/assets/images/combo-date-night.jpeg",
  "College Quick Glam": "/src/assets/images/combo-college.jpeg",
  "Party Glow Box": "/src/assets/images/combo-party.jpeg",
};

export default function Combos() {
  const { data: combos, isLoading } = useListCombos();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const addComboToCartMutation = useAddComboToCart();
  const [addingComboId, setAddingComboId] = useState<number | null>(null);

  const handleAddComboToCart = (combo: NonNullable<typeof combos>[number]) => {
    setAddingComboId(combo.id);
    addComboToCartMutation.mutate(
      {
        data: {
          comboId: combo.id,
          comboName: combo.name,
          comboPrice: combo.comboPrice,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            title: "Combo added to cart!",
            description: `${combo.name} — $${combo.comboPrice.toFixed(2)} added to cart`,
          });
          setAddingComboId(null);
        },
        onError: () => {
          toast({
            title: "Oops!",
            description: "Failed to add combo to cart. Please try again.",
            variant: "destructive",
          });
          setAddingComboId(null);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-secondary py-16 md:py-24 border-b border-white">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-4">
              Value Combos
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get the full look in one box. Curated combinations at a delicious discount.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="space-y-16">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl border border-secondary">
                    <Skeleton className="w-full md:w-1/2 aspect-[4/3] rounded-2xl bg-secondary" />
                    <div className="w-full md:w-1/2 space-y-4 py-6">
                      <Skeleton className="h-10 w-2/3 bg-secondary" />
                      <Skeleton className="h-4 w-full bg-secondary" />
                      <Skeleton className="h-4 w-3/4 bg-secondary" />
                      <Skeleton className="h-12 w-40 rounded-full mt-8 bg-secondary" />
                    </div>
                  </div>
                ))
              : combos?.map((combo, index) => {
                  const isAdding = addingComboId === combo.id;
                  return (
                    <div
                      key={combo.id}
                      className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 lg:gap-16 items-center bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-secondary/50 border border-secondary group hover:border-primary/20 transition-colors`}
                    >
                      <div className="w-full md:w-1/2">
                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-inner">
                          <img
                            src={comboImageMap[combo.name] || "/src/assets/images/combo-date-night.jpeg"}
                            alt={combo.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-sm tracking-widest uppercase shadow-sm">
                            Save{" "}
                            {combo.originalPrice && combo.originalPrice > combo.comboPrice
                              ? Math.round(((combo.originalPrice - combo.comboPrice) / combo.originalPrice) * 100)
                              : 20}
                            %
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 lg:px-8">
                        <div>
                          <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-4 leading-tight">{combo.name}</h2>
                          <p className="text-muted-foreground text-lg leading-relaxed">{combo.description}</p>
                        </div>

                        <div className="bg-secondary/30 rounded-2xl p-6 border border-secondary">
                          <h4 className="font-bold uppercase tracking-wider text-xs mb-4 text-primary">What's in the box</h4>
                          <ul className="space-y-3">
                            {combo.products?.map((product) => (
                              <li key={product.id} className="flex justify-between items-center text-sm font-medium">
                                <span className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                  {product.name}
                                </span>
                                <span className="text-muted-foreground">${product.price.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                          <div className="flex items-end gap-3 w-full sm:w-auto justify-center sm:justify-start">
                            <div className="text-4xl font-bold text-foreground">${combo.comboPrice.toFixed(2)}</div>
                            {combo.originalPrice && (
                              <div className="text-lg text-muted-foreground line-through pb-1">${combo.originalPrice.toFixed(2)}</div>
                            )}
                          </div>
                          <Button
                            size="lg"
                            disabled={isAdding}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-10 py-6 text-lg shadow-lg shadow-primary/20 disabled:opacity-70"
                            onClick={() => handleAddComboToCart(combo)}
                          >
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            {isAdding ? "Adding..." : "Add to Cart"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
