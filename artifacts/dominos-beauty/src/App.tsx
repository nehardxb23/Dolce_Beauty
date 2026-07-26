import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignInPrompt } from "@/components/SignInPrompt";
import { LiveChatLauncher } from "@/components/LiveChat";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Combos from "@/pages/combos";
import AiMatch from "@/pages/ai-match";
import Cart from "@/pages/cart";
import ProductDetail from "@/pages/product";
import Checkout from "@/pages/checkout";
import OrderConfirmation from "@/pages/order-confirmation";
import Profile from "@/pages/Profile";
import About from "@/pages/about";
import Careers from "@/pages/careers";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/combos" component={Combos} />
      <Route path="/ai-match" component={AiMatch} />
      <Route path="/cart" component={Cart} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/profile" component={Profile} />
      <Route path="/about" component={About} />
      <Route path="/careers" component={Careers} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <SignInPrompt />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
