import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Zap, Leaf, Star, Users, Globe } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every formula is crafted with obsessive care — from pigment selection to packaging. We don't cut corners on what touches your skin.",
  },
  {
    icon: Zap,
    title: "Speed is a Feature",
    description:
      "We built our logistics like a pizza chain: your order is picked, packed, and dispatched in under an hour. Beauty shouldn't make you wait.",
  },
  {
    icon: Leaf,
    title: "Clean Ingredients",
    description:
      "No parabens, no sulfates, no compromises. Our products are cruelty-free, vegan-friendly, and formulated for every skin tone.",
  },
  {
    icon: Star,
    title: "Inclusivity First",
    description:
      "We launched with small range of shades but will surely promise to get 20+ shades because the beauty industry still hasn't got it right. We're changing that — one palette at a time.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description:
      "Our best products come from listening to our customers. Every review, DM, and suggestion shapes what we build next.",
  },
  {
    icon: Globe,
    title: "Planet Positive",
    description:
      "Recycled packaging, carbon-neutral shipping, and 1% of every sale goes toward reforestation. Looking good shouldn't cost the earth.",
  },
];

const team = [
  {
    name: "Neha Ravi Kumar",
    role: "Co-Founder & CEO",
    bio: "The visionary behind Dolce Beauty, turning the dream of quick makeup delivery into a reality with a bold, Gen Z-first approach to beauty.",
    avatar: "NR",
    color: "bg-primary",
  },
  {
    name: "Mamatha Ravi Kumar",
    role: "Co-Founder & CTO",
    bio: "Leads the technology that powers our lightning-fast deliveries, ensuring every beauty order arrives fresh, fast, and flawlessly.",
    avatar: "MR",
    color: "bg-foreground",
  },
  {
    name: "Nikhil Ravi Kumar",
    role: "Head of Product",
    bio: "Curates trend-forward beauty collections, carefully selecting products that combine quality, performance, and the latest beauty trends.",
    avatar: "NR",
    color: "bg-primary/80",
  },
  {
    name: "Ravi Kumar",
    role: "Creative Director",
    bio: "The creative force behind Dolce Beauty's signature pizza-inspired packaging and playful visual identity that makes every order unforgettable.",
    avatar: "RK",
    color: "bg-foreground/80",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />      {/* Hero */}
      <section className="bg-foreground text-background py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,_hsl(var(--primary))_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Our Story</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold max-w-3xl mb-6 leading-tight">
            Beauty, delivered like a <span className="text-primary">hot pizza</span>.
          </h1>
          <p className="text-background/60 text-lg md:text-xl max-w-2xl leading-relaxed">We started Dolce Beauty because we were tired of boring packaging and waiting two weeks for a makeup product to arrive. If a pizza can show up in 30 minutes, why can't your favourite makeup product? Turns out — it can.</p>
        </div>
      </section>
      {/* Mission */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl font-bold mb-6">The idea was absurdly simple</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              In 2026, Neha Ravi Kumar imagined a beauty brand that broke every rule. Instead of waiting days for makeup deliveries, she asked a simple question: Why can't ordering your favorite lipstick feel as exciting—and as fast—as ordering a hot pizza? That idea became Dolce Beauty, where bold beauty meets instant gratification, wrapped in a playful pizza-inspired experience designed for the Gen Z generation.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From lightning-fast less than 45-minute delivery to iconic pizza-box packaging, every detail of Dolce Beauty is made to surprise and delight. We blend premium beauty products with the fun, shareable energy of food culture, turning every order into an unboxing experience worth posting. Because great makeup shouldn't just look good—it should arrive hot, fast, and unforgettable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "2026", label: "Founded" },
              { stat: "20+", label: "Shade range" },
              { stat: "120k+", label: "Happy customers" },
              { stat: "< 45min", label: "Average delivery" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-secondary/40 rounded-2xl p-6 border border-secondary flex flex-col gap-1"
              >
                <span className="font-serif text-4xl font-bold text-primary">{item.stat}</span>
                <span className="text-muted-foreground text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Values */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-4">What we stand for</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Six principles that guide every decision we make — from formulation to fulfilment.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-8 border border-secondary hover:border-primary/30 hover:shadow-lg hover:shadow-secondary/50 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Team */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="font-serif text-4xl font-bold text-center mb-4">Meet the team</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          A small, passionate crew that moves fast and ships even faster.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl p-6 border border-secondary hover:border-primary/30 hover:shadow-lg transition-all text-center group"
            >
              <div
                className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 group-hover:scale-105 transition-transform`}
              >
                {member.avatar}
              </div>
              <h3 className="font-semibold text-base mb-0.5">{member.name}</h3>
              <p className="text-primary text-xs font-medium mb-3">{member.role}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
