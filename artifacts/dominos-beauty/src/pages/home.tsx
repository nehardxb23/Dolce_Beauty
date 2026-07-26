import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import {
  useGetBestsellers,
  useListCombos,
  useListReviews,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import heroModel from "@/assets/images/hero-model.jpeg";
import { Package, Truck, Sparkles, ChevronRight, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Mock image map for combos
import comboDateNight from "@/assets/images/combo-date-night.jpeg";
import comboCollege from "@/assets/images/combo-college.jpeg";
import comboParty from "@/assets/images/combo-party.jpeg";

const comboImageMap = {
  "Date Night Kit": comboDateNight,
  "College Quick Glam": comboCollege,
  "Party Glow Box": comboParty,
};

export default function Home() {
  const { data: bestsellers, isLoading: isBestsellersLoading } =
    useGetBestsellers();
  const { data: combos, isLoading: isCombosLoading } = useListCombos();
  const { data: reviews, isLoading: isReviewsLoading } = useListReviews();

  const [builderState, setBuilderState] = useState({
    skinTone: "",
    lipstick: "",
    blush: "",
    eyeshadow: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  const lookLabels: Record<string, Record<string, string>> = {
    skinTone: {
      fair: "Fair (Mozzarella)",
      light: "Light (Parmesan)",
      medium: "Medium (Cheddar)",
      deep: "Deep (Provolone)",
    },
    lipstick: {
      red: "Classic Red (Marinara)",
      pink: "Soft Pink (Blush)",
      nude: "Nude (Crust)",
    },
    blush: {
      peach: "Peach (Pepperoni)",
      rose: "Rose (Tomato)",
      berry: "Berry (Sausage)",
    },
    eyeshadow: {
      warm: "Warm Neutrals (Toasted)",
      cool: "Cool Tones (Mushroom)",
      smokey: "Smokey (Olive)",
    },
  };

  const lipstickColors: Record<string, string> = {
    red: "#C0392B",
    pink: "#E8A0A0",
    nude: "#D4A89A",
  };
  const blushColors: Record<string, string> = {
    peach: "#FFAA80",
    rose: "#E8637C",
    berry: "#9B4060",
  };
  const eyeshadowColors: Record<string, string> = {
    warm: "#C49A6C",
    cool: "#8899BB",
    smokey: "#556655",
  };
  const skinColors: Record<string, string> = {
    fair: "#FAE3D9",
    light: "#F5CBA7",
    medium: "#D4956A",
    deep: "#7D4E2D",
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden bg-secondary">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNDMDM5MkIiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50"></div>

          {/* Floating decorative elements */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/3 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700"></div>

          <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="space-y-4">
                  <h1 className="font-script text-6xl md:text-8xl text-primary leading-tight transform -rotate-2 origin-left">
                    Get Ready in <br />
                    <span className="text-foreground">10 Minutes</span>
                  </h1>
                  <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground/80 tracking-wide mt-4">
                    Makeup Delivered Like Pizza.{" "}
                    <br className="hidden md:block" />
                    Hot, Fresh, and Exactly What You Ordered.
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/shop">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                      Order Your Look
                    </Button>
                  </Link>
                  <Link href="/combos">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/5 rounded-full px-8 py-6 text-lg hover:-translate-y-1 transition-all"
                    >
                      Build Your Combo
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl transform scale-110"></div>
                <div className="relative rounded-t-full overflow-hidden border-8 border-white shadow-2xl aspect-[4/5] max-w-md mx-auto">
                  <img
                    src={heroModel}
                    alt="Glamorous woman applying red lipstick"
                    className="w-full h-full object-cover"
                  />
                  {/* Decorative pizza box sticker */}
                  <div className="absolute bottom-6 -right-6 bg-accent text-accent-foreground font-bold py-2 px-6 transform -rotate-12 shadow-lg border-2 border-white rounded font-serif italic text-lg">
                    Hot & Ready!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 md:py-24 bg-white border-y border-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                The Dolce Method
              </h2>
              <p className="text-muted-foreground">
                Three easy steps to your perfect look. Fast delivery, flawless
                finish.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-secondary -translate-y-1/2 z-0 border-t-2 border-dashed border-primary/20"></div>

              {[
                {
                  icon: Package,
                  title: "1. Choose Your Base",
                  desc: "Select your foundation or skin tint for the perfect canvas.",
                },
                {
                  icon: Sparkles,
                  title: "2. Pick Your Toppings",
                  desc: "Add blush, highlighter, and lipstick to build your flavor.",
                },
                {
                  icon: Truck,
                  title: "3. Fast Delivery",
                  desc: "Delivered to your door, ready to wear.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-500">
                    <step.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOOK BUILDER */}
        <section className="py-20 md:py-32 bg-secondary relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-50"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-white/50 max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-primary">
                  Build Your Look
                </h2>
                <p className="text-muted-foreground">
                  Select your options and preview your custom combo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Skin Tone
                  </label>
                  <Select
                    onValueChange={(v) =>
                      setBuilderState({ ...builderState, skinTone: v })
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/30 border-transparent focus:border-primary rounded-xl">
                      <SelectValue placeholder="Select Base" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fair">Fair (Mozzarella)</SelectItem>
                      <SelectItem value="light">Light (Parmesan)</SelectItem>
                      <SelectItem value="medium">Medium (Cheddar)</SelectItem>
                      <SelectItem value="deep">Deep (Provolone)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Lipstick
                  </label>
                  <Select
                    onValueChange={(v) =>
                      setBuilderState({ ...builderState, lipstick: v })
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/30 border-transparent focus:border-primary rounded-xl">
                      <SelectValue placeholder="Select Lip" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">
                        Classic Red (Marinara)
                      </SelectItem>
                      <SelectItem value="pink">Soft Pink (Blush)</SelectItem>
                      <SelectItem value="nude">Nude (Crust)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Blush
                  </label>
                  <Select
                    onValueChange={(v) =>
                      setBuilderState({ ...builderState, blush: v })
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/30 border-transparent focus:border-primary rounded-xl">
                      <SelectValue placeholder="Select Blush" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="peach">Peach (Pepperoni)</SelectItem>
                      <SelectItem value="rose">Rose (Tomato)</SelectItem>
                      <SelectItem value="berry">Berry (Sausage)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Eyeshadow
                  </label>
                  <Select
                    onValueChange={(v) =>
                      setBuilderState({ ...builderState, eyeshadow: v })
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/30 border-transparent focus:border-primary rounded-xl">
                      <SelectValue placeholder="Select Eye" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">
                        Warm Neutrals (Toasted)
                      </SelectItem>
                      <SelectItem value="cool">
                        Cool Tones (Mushroom)
                      </SelectItem>
                      <SelectItem value="smokey">Smokey (Olive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  data-testid="button-preview-look"
                  className="bg-foreground hover:bg-foreground/90 text-white rounded-full px-10 py-6 text-lg group"
                  onClick={() => setShowPreview(true)}
                >
                  Preview Look
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* LIVE PREVIEW PANEL */}
              {showPreview && (
                <div className="mt-8 p-6 bg-secondary/40 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-center font-serif text-xl font-bold mb-5 text-primary">
                    Your Custom Look
                  </h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Face preview */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <svg
                        width="120"
                        height="140"
                        viewBox="0 0 120 140"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Head / skin */}
                        <ellipse
                          cx="60"
                          cy="70"
                          rx="50"
                          ry="60"
                          fill={
                            builderState.skinTone
                              ? skinColors[builderState.skinTone]
                              : "#FAE3D9"
                          }
                          stroke="#D4A89A"
                          strokeWidth="1.5"
                        />
                        {/* Eyes */}
                        <ellipse
                          cx="40"
                          cy="58"
                          rx="9"
                          ry="5"
                          fill={
                            builderState.eyeshadow
                              ? eyeshadowColors[builderState.eyeshadow]
                              : "#C49A6C"
                          }
                          opacity="0.7"
                        />
                        <ellipse
                          cx="80"
                          cy="58"
                          rx="9"
                          ry="5"
                          fill={
                            builderState.eyeshadow
                              ? eyeshadowColors[builderState.eyeshadow]
                              : "#C49A6C"
                          }
                          opacity="0.7"
                        />
                        <circle cx="40" cy="58" r="4" fill="#2C1810" />
                        <circle cx="80" cy="58" r="4" fill="#2C1810" />
                        <circle cx="42" cy="56" r="1.5" fill="white" />
                        <circle cx="82" cy="56" r="1.5" fill="white" />
                        {/* Eyebrows */}
                        <path
                          d="M31 50 Q40 46 49 50"
                          stroke="#5C3A1E"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M71 50 Q80 46 89 50"
                          stroke="#5C3A1E"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Nose */}
                        <path
                          d="M57 68 Q55 78 52 82 Q60 85 68 82 Q65 78 63 68"
                          stroke="#C4956A"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                        {/* Blush */}
                        <ellipse
                          cx="28"
                          cy="78"
                          rx="12"
                          ry="7"
                          fill={
                            builderState.blush
                              ? blushColors[builderState.blush]
                              : "#FFAA80"
                          }
                          opacity={builderState.blush ? "0.45" : "0.2"}
                        />
                        <ellipse
                          cx="92"
                          cy="78"
                          rx="12"
                          ry="7"
                          fill={
                            builderState.blush
                              ? blushColors[builderState.blush]
                              : "#FFAA80"
                          }
                          opacity={builderState.blush ? "0.45" : "0.2"}
                        />
                        {/* Lips */}
                        <path
                          d="M45 100 Q60 108 75 100 Q60 96 45 100Z"
                          fill={
                            builderState.lipstick
                              ? lipstickColors[builderState.lipstick]
                              : "#C0392B"
                          }
                          opacity="0.85"
                        />
                        <path
                          d="M45 100 Q52 95 60 94 Q68 95 75 100"
                          stroke={
                            builderState.lipstick
                              ? lipstickColors[builderState.lipstick]
                              : "#C0392B"
                          }
                          strokeWidth="2"
                          fill="none"
                        />
                        {/* Hair */}
                        <ellipse
                          cx="60"
                          cy="17"
                          rx="50"
                          ry="20"
                          fill="#3D2B1F"
                        />
                        <ellipse
                          cx="10"
                          cy="70"
                          rx="12"
                          ry="45"
                          fill="#3D2B1F"
                        />
                        <ellipse
                          cx="110"
                          cy="70"
                          rx="12"
                          ry="45"
                          fill="#3D2B1F"
                        />
                      </svg>
                    </div>

                    {/* Selected options list */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {(
                        ["skinTone", "lipstick", "blush", "eyeshadow"] as const
                      ).map((key) => {
                        const label = {
                          skinTone: "Base",
                          lipstick: "Lip Color",
                          blush: "Blush",
                          eyeshadow: "Eyeshadow",
                        }[key];
                        const value = builderState[key];
                        const displayName = value
                          ? lookLabels[key][value]
                          : null;
                        return (
                          <div
                            key={key}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${value ? "border-primary/20 bg-white" : "border-dashed border-muted-foreground/30 bg-transparent"}`}
                          >
                            <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                              style={{
                                background:
                                  key === "skinTone" && value
                                    ? skinColors[value]
                                    : key === "lipstick" && value
                                      ? lipstickColors[value]
                                      : key === "blush" && value
                                        ? blushColors[value]
                                        : key === "eyeshadow" && value
                                          ? eyeshadowColors[value]
                                          : "#E5E5E5",
                              }}
                            />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                {label}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {displayName ?? "Not selected"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"
                      onClick={() => (window.location.href = "/ai-match")}
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Find Matching
                      Products
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full px-8 border-primary/30 text-primary"
                      onClick={() => {
                        setShowPreview(false);
                        setBuilderState({
                          skinTone: "",
                          lipstick: "",
                          blush: "",
                          eyeshadow: "",
                        });
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BEST SELLERS */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                  Hot Out The Oven
                </h2>
                <p className="text-muted-foreground text-lg">
                  Our best-selling products, ready to be devoured.
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden md:flex text-primary font-semibold items-center hover:underline hover:underline-offset-4"
              >
                View All Menu <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {isBestsellersLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-4">
                      <Skeleton className="h-64 w-full rounded-xl bg-secondary" />
                      <Skeleton className="h-4 w-1/3 bg-secondary" />
                      <Skeleton className="h-6 w-3/4 bg-secondary" />
                      <Skeleton className="h-10 w-full rounded-full bg-secondary" />
                    </div>
                  ))
                : bestsellers?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
            <div className="mt-10 text-center md:hidden">
              <Link href="/shop">
                <Button variant="outline" className="rounded-full w-full">
                  View All Menu
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* COMBO KITS */}
        <section className="py-20 md:py-32 bg-foreground text-background relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-white">
                Value Combos
              </h2>
              <p className="text-background/70 text-lg">
                Get more for less with our curated pizza-box bundles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isCombosLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-96 w-full rounded-2xl bg-white/10"
                    />
                  ))
                : combos?.slice(0, 3).map((combo) => (
                    <div
                      key={combo.id}
                      className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-colors duration-500 flex flex-col"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative p-6">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                        <img
                          src={
                            comboImageMap[combo.name] ||
                            "/images/combo-date-night.jpeg"
                          }
                          alt={combo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-xl"
                        />
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                          <div className="flex justify-between items-end mb-2">
                            <h3 className="font-serif font-bold text-2xl text-white leading-tight">
                              {combo.name}
                            </h3>
                            <div className="text-right">
                              {combo.originalPrice && (
                                <div className="text-white/50 line-through text-sm">
                                  ${combo.originalPrice.toFixed(2)}
                                </div>
                              )}
                              <div className="text-accent font-bold text-xl">
                                ${combo.comboPrice.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 pt-0 bg-black/20 flex-grow flex flex-col justify-between">
                        <p className="text-white/70 text-sm mb-6 line-clamp-2">
                          {combo.description}
                        </p>
                        <Link href={`/combos`} className="block w-full">
                          <Button className="w-full bg-primary hover:bg-white hover:text-primary transition-colors text-white rounded-full">
                            Shop Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* AI MATCH */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-secondary to-white border-b border-secondary">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-6 border border-secondary">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Look
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Not sure what to order? Let our AI recommend the perfect makeup
              combo based on your skin tone and occasion.
            </p>
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-white/50">
              <div className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto items-center">
                <Select>
                  <SelectTrigger className="w-full h-14 bg-secondary/20 border-transparent focus:border-primary rounded-xl text-lg">
                    <SelectValue placeholder="Skin Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="deep">Deep</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-muted-foreground font-serif italic text-xl">
                  for
                </div>
                <Select>
                  <SelectTrigger className="w-full h-14 bg-secondary/20 border-transparent focus:border-primary rounded-xl text-lg">
                    <SelectValue placeholder="Occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyday">Everyday Look</SelectItem>
                    <SelectItem value="datenight">Date Night</SelectItem>
                    <SelectItem value="party">Party Glam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-10">
                <Link href="/ai-match">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-7 text-xl shadow-lg shadow-primary/30 group"
                  >
                    Find My Match
                    <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4 text-center max-w-5xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-16">
              Five Star Reviews
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {isReviewsLoading ? (
                <Skeleton className="h-48 w-full max-w-sm rounded-2xl bg-secondary" />
              ) : (
                reviews?.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="bg-secondary/30 p-8 rounded-3xl max-w-sm text-left border border-secondary flex flex-col"
                  >
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "text-accent fill-accent" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="font-serif italic text-lg mb-6 flex-grow">
                      "{review.text}"
                    </p>
                    <p className="font-bold font-sans text-sm uppercase tracking-wider text-muted-foreground">
                      — {review.author}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
