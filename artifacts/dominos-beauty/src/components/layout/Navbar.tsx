import { Link, useLocation } from "wouter";
import { ShoppingBag, User, Menu, Pizza } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const { data: cart } = useGetCart();
  const { user, isAuthenticated, login } = useAuth();
  const itemCount = cart?.itemCount || 0;

  const isActive = (path: string) => location === path;

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-secondary/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded transform -rotate-12 group-hover:rotate-0 transition-transform duration-300 flex flex-col p-1 justify-between shadow-lg">
            <div className="flex justify-between">
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
            <div className="w-full h-px bg-white/50" />
            <div className="flex justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-primary">
            Dolce <span className="font-sans text-lg text-foreground/80 italic ml-1">Beauty</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className={`hover:text-primary transition-colors ${isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground/80'}`}>Home</Link>
          <Link href="/shop" className={`hover:text-primary transition-colors ${isActive('/shop') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground/80'}`}>Shop</Link>
          <Link href="/combos" className={`hover:text-primary transition-colors ${isActive('/combos') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground/80'}`}>Combos</Link>
          <Link href="/ai-match" className={`hover:text-primary transition-colors ${isActive('/ai-match') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground/80'}`}>AI Match</Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="hidden sm:flex text-foreground/70 hover:text-primary hover:bg-secondary/50 rounded-full relative" title={displayName}>
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                ) : initials ? (
                  <span className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {initials}
                  </span>
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={login}
              className="hidden sm:flex text-foreground/70 hover:text-primary hover:bg-secondary/50 rounded-full"
              title="Sign in"
            >
              <User className="h-5 w-5" />
            </Button>
          )}

          <Link href="/cart" className="relative group">
            <Button variant="ghost" size="icon" className="text-foreground/70 group-hover:text-primary group-hover:bg-secondary/50 rounded-full">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <Link href="/profile" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary">
              <Pizza className="w-4 h-4" />
              <span>{(user as { loyaltyPoints?: number })?.loyaltyPoints ?? 0} slices</span>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden text-foreground/70">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
