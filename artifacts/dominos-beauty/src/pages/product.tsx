import { useParams, Link } from "wouter";
import { ShoppingBag, ArrowLeft, Star, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useGetProduct,
  useListReviews,
  useAddToCart,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getProductImage } from "@/lib/imageMap";

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError } = useGetProduct(productId);
  const { data: reviews } = useListReviews();
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            title: "Added to cart!",
            description: `${product.name} is on its way.`,
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{product?.name ?? "Product"}</span>
        </nav>

        {isError && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Product not found.</p>
            <Link href="/shop">
              <Button variant="outline" className="mt-4 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
              </Button>
            </Link>
          </div>
        )}

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <Skeleton className="aspect-square rounded-2xl bg-secondary" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24 bg-secondary" />
              <Skeleton className="h-10 w-3/4 bg-secondary" />
              <Skeleton className="h-6 w-20 bg-secondary" />
              <Skeleton className="h-24 bg-secondary" />
              <Skeleton className="h-12 w-full rounded-full bg-secondary" />
            </div>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Product image */}
            <div className="relative bg-secondary/20 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={getProductImage(product.name)}
                alt={product.name}
                className="w-4/5 h-4/5 object-contain mix-blend-multiply"
              />
              {product.isBestseller && (
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full">
                  Best Seller
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col justify-center">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                {product.category}
              </div>

              <h1 className="font-serif text-4xl font-bold leading-tight mb-4">
                {product.name}
              </h1>

              {product.rating && (
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={Number(product.rating)} />
                  <span className="text-sm text-muted-foreground">
                    {Number(product.rating).toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              <p className="text-3xl font-bold text-primary mb-6">
                ${Number(product.price).toFixed(2)}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {product.skinTone && (
                <div className="mb-6">
                  <span className="text-sm font-semibold text-foreground">Shade: </span>
                  <Badge variant="secondary" className="ml-1 rounded-full">{product.skinTone}</Badge>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                >
                  {addToCartMutation.isPending ? (
                    "Adding..."
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Link href="/shop">
                  <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {/* Reviews section */}
        {reviews && reviews.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-3xl font-bold mb-8">
              Customer Reviews
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/50"
                >
                  <StarRating rating={review.rating} />
                  <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                    "{review.text}"
                  </p>
                  <p className="mt-4 font-semibold text-sm text-foreground">
                    — {review.author}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
