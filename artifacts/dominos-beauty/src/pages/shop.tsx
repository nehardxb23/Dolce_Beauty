import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useListProducts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = ["All", "Foundation", "Lipstick", "Blush", "Eyeshadow", "Highlighter"];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const queryParams = activeCategory === "All" ? undefined : { category: activeCategory };
  const { data: products, isLoading } = useListProducts(queryParams);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-primary/5 py-12 md:py-20 border-b border-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4">The Menu</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Freshly baked beauty products. Browse our full selection of high-quality, long-lasting makeup.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={setActiveCategory}>
              <TabsList className="bg-secondary/50 p-1 w-full justify-start overflow-x-auto h-auto flex-nowrap rounded-xl">
                {CATEGORIES.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 py-2.5 whitespace-nowrap"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="text-sm text-muted-foreground font-medium whitespace-nowrap">
              Showing {products?.length || 0} items
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl bg-secondary" />
                  <Skeleton className="h-4 w-1/3 bg-secondary" />
                  <Skeleton className="h-6 w-3/4 bg-secondary" />
                  <Skeleton className="h-10 w-full rounded-full bg-secondary" />
                </div>
              ))
            ) : products?.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <h3 className="font-serif text-2xl font-bold mb-2">No items found</h3>
                <p className="text-muted-foreground">We couldn't find any products in this category.</p>
              </div>
            ) : (
              products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
