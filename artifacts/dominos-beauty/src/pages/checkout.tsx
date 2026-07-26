import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCart, usePlaceOrder, getGetCartQueryKey, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getProductImage } from "@/lib/imageMap";

const comboImageMap: Record<string, string> = {
  "Date Night Kit": "/src/assets/images/combo-date-night.jpeg",
  "College Quick Glam": "/src/assets/images/combo-college.jpeg",
  "Party Glow Box": "/src/assets/images/combo-party.jpeg",
};
import { ChevronRight, Lock, CreditCard, MapPin, User } from "lucide-react";
import { Link } from "wouter";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardName: "",
};

export default function Checkout() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isPlacing, setIsPlacing] = useState(false);

  const { data: cart, isLoading } = useGetCart();
  const placeOrderMutation = usePlaceOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.address1.trim()) e.address1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (form.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter 16-digit card number";
    if (form.cardExpiry.length < 5) e.cardExpiry = "MM/YY required";
    if (form.cardCvc.length < 3) e.cardCvc = "3-digit CVC required";
    if (!form.cardName.trim()) e.cardName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setIsPlacing(true);

    placeOrderMutation.mutate(
      {
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          address: [form.address1, form.address2, form.city, form.state, form.zip, form.country]
            .filter(Boolean)
            .join(", "),
        },
      },
      {
        onSuccess: (order) => {
          // Invalidate cart + order list so profile reflects the new order + points
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          navigate(`/order-confirmation?order=${order.id}&name=${encodeURIComponent(form.firstName)}`);
        },
        onError: () => {
          toast({ title: "Something went wrong", description: "Could not place your order. Please try again.", variant: "destructive" });
          setIsPlacing(false);
        },
      }
    );
  };

  const subtotal = cart?.total ?? 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        <h1 className="font-serif text-4xl font-bold mb-10">Checkout</h1>

        {isLoading ? (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl bg-secondary" />)}
            </div>
            <Skeleton className="h-80 rounded-3xl bg-secondary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-10">
              {/* Shipping */}
              <section className="bg-white rounded-3xl border border-secondary shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-6 border-b border-secondary bg-secondary/10">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h2 className="font-bold uppercase tracking-wider text-sm text-muted-foreground">Delivery Address</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={form.firstName} onChange={set("firstName")} className={`mt-1.5 rounded-xl ${errors.firstName ? "border-destructive" : ""}`} placeholder="Jane" />
                    {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={form.lastName} onChange={set("lastName")} className={`mt-1.5 rounded-xl ${errors.lastName ? "border-destructive" : ""}`} placeholder="Doe" />
                    {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={set("email")} className={`mt-1.5 rounded-xl ${errors.email ? "border-destructive" : ""}`} placeholder="jane@example.com" />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.phone} onChange={set("phone")} className="mt-1.5 rounded-xl" placeholder="+1 555 000 0000" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input id="address1" value={form.address1} onChange={set("address1")} className={`mt-1.5 rounded-xl ${errors.address1 ? "border-destructive" : ""}`} placeholder="123 Pepperoni Street" />
                    {errors.address1 && <p className="text-destructive text-xs mt-1">{errors.address1}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input id="address2" value={form.address2} onChange={set("address2")} className="mt-1.5 rounded-xl" placeholder="Apt, suite, etc." />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" value={form.city} onChange={set("city")} className={`mt-1.5 rounded-xl ${errors.city ? "border-destructive" : ""}`} placeholder="New York" />
                    {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" value={form.state} onChange={set("state")} className="mt-1.5 rounded-xl" placeholder="NY" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP / Postal Code *</Label>
                    <Input id="zip" value={form.zip} onChange={set("zip")} className={`mt-1.5 rounded-xl ${errors.zip ? "border-destructive" : ""}`} placeholder="10001" />
                    {errors.zip && <p className="text-destructive text-xs mt-1">{errors.zip}</p>}
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={form.country} onChange={set("country")} className="mt-1.5 rounded-xl" />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="bg-white rounded-3xl border border-secondary shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-6 border-b border-secondary bg-secondary/10">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h2 className="font-bold uppercase tracking-wider text-sm text-muted-foreground">Payment Details</h2>
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" /> Secure
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input id="cardName" value={form.cardName} onChange={set("cardName")} className={`mt-1.5 rounded-xl ${errors.cardName ? "border-destructive" : ""}`} placeholder="Jane Doe" />
                    {errors.cardName && <p className="text-destructive text-xs mt-1">{errors.cardName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={form.cardNumber}
                      onChange={(e) => setForm((f) => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                      className={`mt-1.5 rounded-xl font-mono tracking-widest ${errors.cardNumber ? "border-destructive" : ""}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && <p className="text-destructive text-xs mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cardExpiry">Expiry Date *</Label>
                    <Input
                      id="cardExpiry"
                      value={form.cardExpiry}
                      onChange={(e) => setForm((f) => ({ ...f, cardExpiry: formatExpiry(e.target.value) }))}
                      className={`mt-1.5 rounded-xl font-mono ${errors.cardExpiry ? "border-destructive" : ""}`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.cardExpiry && <p className="text-destructive text-xs mt-1">{errors.cardExpiry}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cardCvc">CVC *</Label>
                    <Input
                      id="cardCvc"
                      value={form.cardCvc}
                      onChange={(e) => setForm((f) => ({ ...f, cardCvc: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                      className={`mt-1.5 rounded-xl font-mono ${errors.cardCvc ? "border-destructive" : ""}`}
                      placeholder="123"
                      maxLength={3}
                    />
                    {errors.cardCvc && <p className="text-destructive text-xs mt-1">{errors.cardCvc}</p>}
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-secondary shadow-xl sticky top-28 overflow-hidden">
                <div className="p-6 border-b border-secondary bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <h3 className="font-bold uppercase tracking-wider text-sm text-muted-foreground">Order Summary</h3>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-secondary max-h-64 overflow-y-auto">
                  {cart?.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-4">
                      <div className="w-14 h-14 bg-secondary/30 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.comboId ? (
                          <img
                            src={comboImageMap[item.comboName ?? ""] || "/src/assets/images/combo-date-night.jpeg"}
                            alt={item.comboName ?? "Combo Kit"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img src={getProductImage(item.product?.name ?? "")} alt={item.product?.name} className="w-full h-full object-cover mix-blend-multiply" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-sm leading-tight truncate">{item.comboName ?? item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm flex-shrink-0">
                        ${((item.comboPrice ?? item.product?.price ?? 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-6">
                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <Separator className="mb-4" />
                  <div className="flex justify-between items-end mb-6">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full rounded-full h-14 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                    onClick={handlePlaceOrder}
                    disabled={isPlacing || !cart?.items.length}
                  >
                    {isPlacing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Placing Order…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Place Order · ${total.toFixed(2)}
                      </span>
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Your payment is encrypted & secure.
                  </p>
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
