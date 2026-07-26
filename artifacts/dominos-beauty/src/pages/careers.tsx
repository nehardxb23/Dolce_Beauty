import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Clock, Briefcase, ArrowRight, Rocket, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  { icon: Rocket, title: "Move fast", description: "No bureaucracy. Ship things, learn, iterate." },
  { icon: Heart, title: "Generous benefits", description: "Health, dental, vision + monthly beauty budget." },
  { icon: Zap, title: "Remote-friendly", description: "Work from wherever. We care about output, not location." },
];

const openRoles = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Help us scale our logistics platform and build the fastest beauty checkout experience on the internet.",
  },
  {
    title: "Cosmetic Product Developer",
    team: "Product",
    location: "Milan, Italy",
    type: "Full-time",
    description:
      "Work closely with our lab partners to develop new formulas and expand our shade range to 80+ options.",
  },
  {
    title: "Brand & Content Designer",
    team: "Creative",
    location: "Remote",
    type: "Full-time",
    description:
      "Own the visual identity of Dolce Beauty across social, packaging, and in-app — from campaigns to micro-animations.",
  },
  {
    title: "Growth Marketing Manager",
    team: "Marketing",
    location: "New York, USA",
    type: "Full-time",
    description:
      "Drive customer acquisition and retention through paid, organic, and partnership channels.",
  },
  {
    title: "Operations & Fulfilment Lead",
    team: "Operations",
    location: "London, UK",
    type: "Full-time",
    description:
      "Oversee our micro-fulfilment network across Europe, ensuring every order arrives in under 45 minutes.",
  },
  {
    title: "Customer Experience Specialist",
    team: "Support",
    location: "Remote",
    type: "Part-time",
    description:
      "Be the first voice customers hear. Resolve issues with empathy, speed, and genuine care.",
  },
];

const teamColors: Record<string, string> = {
  Engineering: "bg-blue-50 text-blue-700 border-blue-100",
  Product: "bg-purple-50 text-purple-700 border-purple-100",
  Creative: "bg-pink-50 text-pink-700 border-pink-100",
  Marketing: "bg-amber-50 text-amber-700 border-amber-100",
  Operations: "bg-green-50 text-green-700 border-green-100",
  Support: "bg-orange-50 text-orange-700 border-orange-100",
};

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-foreground text-background py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_70%_50%,_hsl(var(--primary))_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">We're hiring</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold max-w-3xl mb-6 leading-tight">
            Help us deliver beauty at <span className="text-primary">pizza speed</span>.
          </h1>
          <p className="text-background/60 text-lg md:text-xl max-w-2xl leading-relaxed">
            We're a small team building something genuinely new. If you're excited by fast shipping, great formulas, and building products people love — you belong here.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 border-b border-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {perks.map((p) => (
              <div key={p.title} className="flex items-start gap-4 bg-secondary/30 rounded-2xl p-6 border border-secondary">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-muted-foreground text-sm">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="font-serif text-4xl font-bold mb-2">Open roles</h2>
        <p className="text-muted-foreground mb-10">
          {openRoles.length} positions available across all teams.
        </p>
        <div className="space-y-4">
          {openRoles.map((role) => (
            <div
              key={role.title}
              className="bg-white border border-secondary rounded-2xl p-6 md:p-8 hover:border-primary/40 hover:shadow-lg hover:shadow-secondary/60 transition-all group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${teamColors[role.team] || "bg-gray-50 text-gray-700 border-gray-100"}`}
                    >
                      {role.team}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {role.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {role.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{role.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{role.description}</p>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors group-hover:border-primary"
                >
                  Apply <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* No role fits */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <Briefcase className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Don't see the right role?</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            We're always looking for exceptional people. Send us your CV and a note about what you'd build here.
          </p>
          <Button className="rounded-full bg-primary text-white hover:bg-primary/90 px-8">
            Send an open application
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
