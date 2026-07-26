import { ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getProductImage } from "@/lib/imageMap";

export function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            title: "Added to cart!",
            description: `${product.name} is on its way.`,
            variant: "default",
          });
        },
        onError: () => {
          toast({
            title: "Oops!",
            description: "Failed to add to cart. Try again.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const imageSrc = getProductImage(product.name);

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <Card className="overflow-hidden border-transparent bg-white shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group flex flex-col h-full cursor-pointer">
        <CardHeader className="p-0 aspect-square relative bg-secondary/20 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply scale-90 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {product.isBestseller && (
            <div className="absolute top-3 left-3 bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
              Best Seller
            </div>
          )}
        </CardHeader>
        <CardContent className="p-5 flex-grow">
          <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">
            {product.category}
          </div>
          <h3 className="font-serif font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-sm shadow-primary/20 hover:shadow-md transition-all group-hover:-translate-y-1"
          >
            {addToCartMutation.isPending ? (
              "Adding..."
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
