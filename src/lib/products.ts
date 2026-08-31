export type Category = "Tech" | "Fashion" | "Cars" | "Food" | "Travel" | "Flex";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  emoji: string;
  /** [highlight, shadow] radial-gradient stops for the tile visual — design.md §11 */
  gradient: [string, string];
  /** popularity_score — plan §7 (drives 🔥 Trending + POPULAR badge) */
  popularity: number;
  /** searchable aliases — plan §36 */
  tags: string[];
}

export const CATEGORIES: Category[] = ["Tech", "Fashion", "Cars", "Food", "Travel", "Flex"];

export const PRODUCTS: Product[] = [
  // Tech
  { id: "flagship-phone", name: "Flagship Phone", tagline: "The one with the impossible camera", category: "Tech", price: 89_999, emoji: "📱", gradient: ["#1b2436", "#0e1220"], popularity: 95, tags: ["iphone", "phone", "mobile", "smartphone", "apple"] },
  { id: "anc-headphones", name: "Silence Pro Headphones", tagline: "Mutes your landlord", category: "Tech", price: 26_999, emoji: "🎧", gradient: ["#23204a", "#10121f"], popularity: 84, tags: ["headphones", "audio", "music", "anc"] },
  { id: "oled-tv", name: '135" OLED Cinema TV', tagline: "Your wall, but interesting", category: "Tech", price: 139_990, emoji: "📺", gradient: ["#0d2b33", "#0a0f16"], popularity: 71, tags: ["tv", "cinema", "oled", "home theatre"] },
  { id: "gaming-rig", name: "Ultimate Gaming Rig", tagline: "300 FPS in the menus", category: "Tech", price: 189_990, emoji: "🖥️", gradient: ["#2b0f3a", "#12081d"], popularity: 89, tags: ["pc", "gaming", "computer", "setup", "rtx"] },
  // Fashion
  { id: "limited-sneakers", name: "Limited Sneakers", tagline: "Numbered. Never worn.", category: "Fashion", price: 24_999, emoji: "👟", gradient: ["#33230f", "#160f08"], popularity: 90, tags: ["shoes", "sneakers", "hype", "jordan"] },
  { id: "designer-jacket", name: "Designer Jacket", tagline: "Winter is an excuse", category: "Fashion", price: 47_500, emoji: "🧥", gradient: ["#103027", "#0a150f"], popularity: 66, tags: ["jacket", "fashion", "winter", "designer"] },
  { id: "gold-chain", name: "22K Gold Chain", tagline: "Grandma approves", category: "Fashion", price: 210_000, emoji: "📿", gradient: ["#3a2c0a", "#181104"], popularity: 74, tags: ["gold", "chain", "jewellery", "luxury"] },
  // Cars
  { id: "superbike", name: "Superbike 1000RR", tagline: "Mid-life crisis, early", category: "Cars", price: 2_199_000, emoji: "🏍️", gradient: ["#301020", "#14070e"], popularity: 82, tags: ["bike", "motorcycle", "superbike", "ducati"] },
  { id: "luxury-sedan", name: "German Luxury Sedan", tagline: "Chauffeur sold separately", category: "Cars", price: 6_200_000, emoji: "🚗", gradient: ["#101c33", "#080d18"], popularity: 87, tags: ["car", "bmw", "mercedes", "sedan", "luxury"] },
  { id: "supercar", name: "Italian Supercar", tagline: "Louder than your opinions", category: "Cars", price: 31_000_000, emoji: "🏎️", gradient: ["#3a0d16", "#160409"], popularity: 93, tags: ["car", "lamborghini", "ferrari", "supercar", "dream"] },
  // Food
  { id: "biryani-feast", name: "Royal Biryani Feast", tagline: "Serves 12. Feeds 2.", category: "Food", price: 2_499, emoji: "🍛", gradient: ["#33240c", "#171005"], popularity: 97, tags: ["biryani", "food", "feast", "hyderabadi"] },
  { id: "sushi-night", name: "Chef's Sushi Night", tagline: "Wasabi has no mercy", category: "Food", price: 8_999, emoji: "🍣", gradient: ["#0d2b2a", "#05110f"], popularity: 72, tags: ["sushi", "japanese", "fine dining", "food"] },
  { id: "gold-dessert", name: "Gold-Leaf Dessert", tagline: "An edible flex", category: "Food", price: 100_000, emoji: "🍰", gradient: ["#2e1a2e", "#130913"], popularity: 58, tags: ["dessert", "gold", "cake", "flex"] },
  // Travel
  { id: "goa-weekend", name: "Goa Weekend Villa", tagline: "Work from beach, allegedly", category: "Travel", price: 45_000, emoji: "🏖️", gradient: ["#0c2d33", "#051215"], popularity: 86, tags: ["goa", "beach", "villa", "vacation"] },
  { id: "tokyo-business", name: "Business Class to Tokyo", tagline: "Lie-flat. Literally.", category: "Travel", price: 280_000, emoji: "✈️", gradient: ["#1a1233", "#0b0718"], popularity: 78, tags: ["japan", "tokyo", "flight", "business class"] },
  { id: "maldives-week", name: "Maldives Overwater Week", tagline: "Blue on blue on blue", category: "Travel", price: 950_000, emoji: "🏝️", gradient: ["#08333d", "#03161a"], popularity: 91, tags: ["maldives", "island", "honeymoon", "vacation", "luxury"] },
  // Flex
  { id: "vip-concert", name: "VIP Concert Box", tagline: "The artist waves at you", category: "Flex", price: 1_500_000, emoji: "🎤", gradient: ["#33102e", "#150614"], popularity: 80, tags: ["concert", "vip", "music", "experience"] },
  { id: "yacht-day", name: "Yacht Charter Day", tagline: "Sunsets included", category: "Flex", price: 1_200_000, emoji: "🛥️", gradient: ["#0a2740", "#04101c"], popularity: 76, tags: ["yacht", "boat", "luxury", "party"] },
  { id: "island-week", name: "Private Island Week", tagline: "Off-grid, on-brand", category: "Flex", price: 8_500_000, emoji: "🌴", gradient: ["#0d3320", "#04150c"], popularity: 88, tags: ["island", "private", "billionaire", "flex"] },
];

/** Top products by popularity — drives 🔥 Trending (plan §6) and search suggestions. */
export function trendingProducts(count = 8): Product[] {
  return [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, count);
}

export const POPULAR_THRESHOLD = 88;
