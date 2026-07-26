import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  {
    name: "Orders & Delivery",
    color: "bg-blue-50 text-blue-700",
    faqs: [
      {
        q: "How fast is delivery?",
        a: "We aim for under 45 minutes in all cities we operate in. Delivery times are shown at checkout based on your postcode. During peak hours it may be slightly longer — we'll always keep you updated.",
      },
      {
        q: "Which cities do you deliver to?",
        a: "We currently deliver in London, New York, Milan, Paris, and Sydney. We're expanding fast — drop your email on the homepage to be notified when we launch in your city.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order is dispatched you'll receive a tracking link via email and SMS. You can follow your delivery in real time on a live map.",
      },
      {
        q: "What if my order arrives damaged?",
        a: "That's on us. Contact our support team within 24 hours with a photo and we'll send a replacement the same day — no questions asked.",
      },
    ],
  },
  {
    name: "Products & Shades",
    color: "bg-pink-50 text-pink-700",
    faqs: [
      {
        q: "Are your products cruelty-free?",
        a: "100%. Every product we sell is cruelty-free and vegan-friendly. We never test on animals and require the same commitment from our lab partners.",
      },
      {
        q: "How do I find my shade?",
        a: "Use our AI Shade Match tool — upload a selfie and our model will recommend your perfect foundation, concealer, and lip shades instantly. No guessing required.",
      },
      {
        q: "What if a shade doesn't suit me?",
        a: "We offer free returns and exchanges within 30 days on unopened products. For lightly used products that genuinely don't work for your skin, contact us — we'll find a solution.",
      },
      {
        q: "Are your products suitable for sensitive skin?",
        a: "Most of our formulas are fragrance-free and dermatologist-tested. Each product page lists full ingredients. When in doubt, our customer team can advise based on your concerns.",
      },
    ],
  },
  {
    name: "Returns & Refunds",
    color: "bg-amber-50 text-amber-700",
    faqs: [
      {
        q: "What is your returns policy?",
        a: "Unopened, unused products can be returned within 30 days for a full refund. We'll email you a free return label — no cost to you.",
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive your return, refunds are processed within 2 business days. Depending on your bank, funds may take 3–5 additional days to appear.",
      },
      {
        q: "Can I exchange a product instead of returning it?",
        a: "Absolutely. If you'd like a different shade or product, just let us know and we'll arrange an exchange — often with same-day turnaround.",
      },
    ],
  },
  {
    name: "Account & Loyalty",
    color: "bg-purple-50 text-purple-700",
    faqs: [
      {
        q: "What are Pizza Slices?",
        a: "Pizza Slices are our loyalty points. You earn 10 slices for every £/$1 spent. Accumulate slices to unlock Bronze, Silver, and Gold status — each tier comes with exclusive perks, early access, and discounts.",
      },
      {
        q: "How do I sign in?",
        a: "We use Replit Auth for secure, passwordless login. Click the profile icon in the top right corner to sign in — no password needed.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Head to your profile page and scroll to Account Settings, or contact support and we'll handle it within 24 hours. We'll confirm once all your data has been removed.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-secondary last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-primary transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium text-sm md:text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-4" : "max-h-0"}`}
      >
        <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [search, setSearch] = useState("");

  const filtered = categories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.faqs.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-secondary/40 py-20 md:py-28 border-b border-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Help Centre</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Everything you need to know about orders, products, and your account.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions…"
              className="pl-10 rounded-full border-secondary h-12 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 container mx-auto px-4 max-w-3xl">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No results found</p>
            <p className="text-sm">Try a different search term, or contact us directly.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filtered.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center gap-3 mb-6">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cat.color}`}>
                    {cat.name}
                  </span>
                </div>
                <div className="bg-white rounded-2xl border border-secondary px-6">
                  {cat.faqs.map((faq) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-16 bg-primary text-white rounded-2xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-white/70 mb-5 text-sm">
            Our team is available 7 days a week and replies within 2 hours.
          </p>
          <a href="/contact">
            <button className="bg-white text-primary font-semibold rounded-full px-8 py-3 text-sm hover:bg-white/90 transition-colors">
              Contact us
            </button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
