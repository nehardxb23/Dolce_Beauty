import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Mail, MessageCircle, Clock, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InlineChatTrigger } from "@/components/LiveChat";

const channels = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Talk to a real human. No bots, no scripts.",
    detail: "Available 9am – 9pm every day",
    cta: "Start chat",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Mail,
    title: "Email",
    description: "Send us a message any time.",
    detail: "hello@dolcebeauty.com",
    cta: "Send email",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Clock,
    title: "Response time",
    description: "We reply to every message within 2 hours during business hours.",
    detail: "Mon – Sun, 9am – 9pm",
    cta: null,
    color: "bg-green-50 text-green-600",
  },
];

const offices = [
  { city: "London", address: "14 Carnaby St, Soho, W1F 9PW", role: "HQ & Fulfilment Hub" },
  { city: "New York", address: "27 West 20th St, Chelsea, NY 10011", role: "North America Office" },
  { city: "Milan", address: "Via Montenapoleone 8, 20121 MI", role: "Product & Lab" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-foreground text-background py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_20%_60%,_hsl(var(--primary))_0%,_transparent_55%)]" />
        <div className="container mx-auto px-4 relative">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Get in touch</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold max-w-2xl mb-4 leading-tight">
            We're here to help.
          </h1>
          <p className="text-background/60 text-lg max-w-xl leading-relaxed">
            Questions, feedback, or just want to say hi? Drop us a message and we'll get back to you fast — we promise.
          </p>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="py-12 border-b border-secondary">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <div
                key={ch.title}
                className="bg-white border border-secondary rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${ch.color}`}>
                  <ch.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1">{ch.title}</h3>
                <p className="text-muted-foreground text-sm mb-1">{ch.description}</p>
                <p className="text-xs text-muted-foreground/70 mb-4">{ch.detail}</p>
                {ch.cta && (
                  <button className="text-primary text-sm font-medium hover:underline">
                    {ch.cta} →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Offices */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Send us a message</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Fill in the form and we'll get back to you within 2 hours.
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Message sent!</h3>
                <p className="text-muted-foreground text-sm">
                  Thanks, {form.name || "friend"}! We'll reply to <strong>{form.email}</strong> within 2 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 text-primary text-sm font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Your name</label>
                    <Input
                      placeholder="Sofia Ricci"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="rounded-xl border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email address</label>
                    <Input
                      type="email"
                      placeholder="sofia@example.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="rounded-xl border-secondary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Subject</label>
                  <Input
                    placeholder="Order issue, shade advice, partnership…"
                    required
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="rounded-xl border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message</label>
                  <Textarea
                    placeholder="Tell us what's on your mind…"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="rounded-xl border-secondary resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary text-white hover:bg-primary/90 h-12 text-base font-medium"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send message
                </Button>
              </form>
            )}
          </div>

          {/* Offices */}
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Our offices</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Say hello in person — we'd love to meet you.
            </p>
            <div className="space-y-4">
              {offices.map((office) => (
                <div
                  key={office.city}
                  className="bg-white border border-secondary rounded-2xl p-6 flex gap-4 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{office.city}</h3>
                    <p className="text-xs text-primary font-medium mb-1">{office.role}</p>
                    <p className="text-muted-foreground text-sm">{office.address}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-8 bg-secondary/30 rounded-2xl p-6 border border-secondary">
              <h3 className="font-semibold mb-3">Follow us</h3>
              <div className="flex flex-wrap gap-3">
                {["Instagram", "TikTok", "Pinterest", "YouTube"].map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium px-4 py-2 bg-white border border-secondary rounded-full text-foreground hover:border-primary/40 cursor-pointer transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
