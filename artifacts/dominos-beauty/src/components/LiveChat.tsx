import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

// ── Knowledge base ──────────────────────────────────────────────────────────
const BOT_NAME = "Dolce";

const RULES: { patterns: RegExp[]; answer: string }[] = [
  {
    patterns: [/hi|hello|hey|good (morning|afternoon|evening)|howdy/i],
    answer: "Hey! 👋 Welcome to Dolce Beauty support. I'm Dolce, your beauty assistant! How can I help you today? You can ask me about orders, products, shipping, returns, or our Pizza Slice rewards. 🍕",
  },
  {
    patterns: [/order.*status|where.*order|track.*order|my order/i],
    answer: "To track your order, head to your **Profile page** (click the person icon in the top right). Your full order history with statuses is listed there. If you just placed an order, it should appear within a few seconds. 📦",
  },
  {
    patterns: [/deliver|shipping|how long|arrival|when.*arrive/i],
    answer: "We promise delivery in **under 45 minutes** within our city zones! 🚀 For areas outside our express zones, standard delivery takes 1–3 business days. You'll get a confirmation email with tracking as soon as your order is packed.",
  },
  {
    patterns: [/return|refund|exchange|money back/i],
    answer: "We have a **30-day hassle-free return** policy. If you're not 100% happy with your order, email us at hello@dolcebeauty.com with your order number and we'll arrange a return or refund within 5 business days. 💅",
  },
  {
    patterns: [/reward|slice|point|loyalty|earn|tier|bronze|silver|gold|diamond/i],
    answer: "Our **Pizza Slice Rewards** are tiered by order value:\n• $10–$18 → 15 slices\n• $18–$30 → 30 slices\n• $30–$50 → 45 slices\n• $50–$80 → 60 slices\n• $80–$100 → 70 slices\n• $100+ → 90 slices 🍕\n\nTiers: Bronze (0), Silver (5,000), Gold (10,000), Diamond (15,000). Check your balance on your Profile page!",
  },
  {
    patterns: [/combo|kit|bundle/i],
    answer: "Our **Combo Kits** are curated sets at a special price — think the Party Glow Box, Date Night Kit, and College Quick Glam. You can browse them on the **Combos** page. Each kit is added to your cart as one item. 💄",
  },
  {
    patterns: [/shade|match|foundation|ai|colour|color|skin tone/i],
    answer: "Try our **AI Shade Match** feature! Go to **AI Match** in the navigation bar, upload a selfie (or use your camera), and we'll recommend the perfect foundation shade from our range. It takes under 10 seconds. ✨",
  },
  {
    patterns: [/product|lipstick|gloss|blush|highlighter|eyeshadow|palette|serum/i],
    answer: "You can browse our full product range on the **Shop** page. We carry foundations, blushes, lip glosses, highlighters, eyeshadow palettes, and more — all named after your favourite pizza toppings! 🍕",
  },
  {
    patterns: [/payment|pay|card|checkout|credit|debit/i],
    answer: "We accept all major credit and debit cards at checkout. Your payment is **encrypted and secure** — look for the lock icon on the checkout page. We don't store your card details. 🔒",
  },
  {
    patterns: [/discount|promo|coupon|code|offer|20%|sale/i],
    answer: "New to Dolce Beauty? Sign up via the **Sign Up Now** banner at the footer to get **20% off your first order**! We also run seasonal offers — follow us on Instagram and TikTok to catch them first. 🎉",
  },
  {
    patterns: [/contact|email|phone|human|agent|real person|speak to/i],
    answer: "You can reach our team any time at **hello@dolcebeauty.com**. During business hours (9am–9pm, Mon–Sun) we reply within 2 hours. You can also use the form on this page. 💌",
  },
  {
    patterns: [/ingredient|vegan|cruelty|gluten|paraben|natural|organic/i],
    answer: "All Dolce Beauty products are **cruelty-free** and **vegan-certified**. We partner with independent cosmetic labs that use small-batch, clean formulations — no parabens, no sulfates. Full ingredient lists are on each product page. 🌿",
  },
  {
    patterns: [/account|sign in|login|sign up|profile|register/i],
    answer: "Click the **person icon** in the top navigation bar to sign in with your Replit account. Your profile keeps your order history and Pizza Slice balance in one place. 👤",
  },
  {
    patterns: [/cart|bag|basket|add to cart/i],
    answer: "Your cart is always accessible from the **bag icon** in the top-right corner. You can add individual products or full Combo Kits. Combo kits are added as a single item so you always know what you ordered. 🛍️",
  },
  {
    patterns: [/thank|thanks|great|perfect|awesome|helpful|love it|amazing/i],
    answer: "You're so welcome! 💕 Is there anything else I can help you with? If not, have a gorgeous day — and happy shopping at Dolce Beauty! 🍕✨",
  },
  {
    patterns: [/bye|goodbye|see you|ciao|later/i],
    answer: "Bye for now! 👋 Remember, we're always here if you need us. Happy shopping! 🍕💄",
  },
];

const FALLBACK = "I'm not sure I caught that — could you rephrase? You can ask me about **orders, shipping, returns, products, shades, combos, or rewards**. I'm here to help! 😊";

function getReply(text: string): string {
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) return rule.answer;
  }
  return FALLBACK;
}

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// Renders **bold** markdown
function BotText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}

// ── Chat window ──────────────────────────────────────────────────────────────
function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Hi there! 👋 I'm **Dolce**, your Dolce Beauty assistant. I can help with orders, shipping, products, returns, and rewards. What can I do for you today?",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now(), role: "user", text, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(text);
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "bot", text: reply, time: now() }]);
    }, 800 + Math.random() * 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl border border-secondary flex flex-col overflow-hidden"
      style={{ height: 520 }}
    >
      {/* Header */}
      <div className="bg-primary px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <Pizza className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight">Dolce Beauty Chat</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-white/80 text-xs">Online now</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/10">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "bot" && (
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <Pizza className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-white text-foreground rounded-tl-sm shadow-sm border border-secondary"
                }`}
              >
                {msg.role === "bot" ? <BotText text={msg.text} /> : msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Pizza className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-white border border-secondary rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-3 pt-2 pb-1 flex gap-1.5 overflow-x-auto scrollbar-none">
        {["Track my order", "Returns policy", "Rewards & slices", "Shade matching"].map((q) => (
          <button
            key={q}
            onClick={() => { setInput(q); }}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-secondary/60 border border-secondary rounded-full text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-secondary flex gap-2 bg-white">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          className="rounded-full border-secondary text-sm h-10 flex-1"
        />
        <Button
          size="icon"
          className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 flex-shrink-0"
          onClick={send}
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ── Floating launcher ────────────────────────────────────────────────────────
export function LiveChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>{open && <ChatWindow onClose={() => setOpen(false)} />}</AnimatePresence>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full shadow-xl shadow-primary/30 flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open live chat"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

// ── Inline trigger (used in contact page card) ───────────────────────────────
export function InlineChatTrigger({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="text-primary text-sm font-medium hover:underline" onClick={() => setOpen(true)}>
        {children}
      </button>
      <AnimatePresence>{open && <ChatWindow onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
