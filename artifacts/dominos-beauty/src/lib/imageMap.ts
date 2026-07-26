import pepperoniBlushImg from "@assets/p1_1784275542055.jpeg";
import margheritaFoundationImg from "@assets/p2_1784276062069.jpeg";
import deepCrustFoundationImg from "@assets/p3_1784276111852.jpeg";
import sunDriedTomatoLipImg from "@assets/p4_1784277905808.jpeg";
import truffleMauveImg from "@assets/p5_1784276843606.jpeg";
import lavaGlowHighlighterImg from "@assets/p6.jpeg";

export const imageMap: Record<string, string> = {
  "Pizza Palette": "/src/assets/images/product-palette.png",
  "Pepperoni Blush": pepperoniBlushImg,
  "Cheese Drip Gloss": "/src/assets/images/product-gloss.png",
  "Lava Glow Highlighter": lavaGlowHighlighterImg,
  "Margherita Foundation": margheritaFoundationImg,
  "Deep Crust Foundation": deepCrustFoundationImg,
  "Sun-Dried Tomato Lip": sunDriedTomatoLipImg,
  "Truffle Mauve": truffleMauveImg,
};

export const getProductImage = (name: string) =>
  imageMap[name] || "/src/assets/images/product-palette.png";
