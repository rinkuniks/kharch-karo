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
  /** Free real photo (Unsplash CDN) — feels like buying the original. Emoji stays as offline fallback. */
  image: string;
  /** Short credit for the photo source (shown in quick view) */
  credit: string;
}

export const CATEGORIES: Category[] = ["Tech", "Fashion", "Cars", "Food", "Travel", "Flex"];

/** Unsplash CDN helper — w=800 keeps tiles sharp but light, q=80 keeps build/deploy fast. */
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
const UNSPLASH = "Photo: Unsplash";

export const PRODUCTS: Product[] = [
  // Tech
  { id: "flagship-phone", name: "Flagship Phone", tagline: "The one with the impossible camera", category: "Tech", price: 89_999, emoji: "📱", gradient: ["#1b2436", "#0e1220"], popularity: 95, tags: ["iphone", "phone", "mobile", "smartphone", "apple"], image: u("photo-1511707171634-5f897ff02aa9"), credit: UNSPLASH },
  { id: "anc-headphones", name: "Silence Pro Headphones", tagline: "Mutes your landlord", category: "Tech", price: 26_999, emoji: "🎧", gradient: ["#23204a", "#10121f"], popularity: 84, tags: ["headphones", "audio", "music", "anc"], image: u("photo-1505740420928-5e560c06d30e"), credit: UNSPLASH },
  { id: "oled-tv", name: '135" OLED Cinema TV', tagline: "Your wall, but interesting", category: "Tech", price: 139_990, emoji: "📺", gradient: ["#0d2b33", "#0a0f16"], popularity: 71, tags: ["tv", "cinema", "oled", "home theatre"], image: u("photo-1593359677879-a4bb92f829d1"), credit: UNSPLASH },
  { id: "gaming-rig", name: "Ultimate Gaming Rig", tagline: "300 FPS in the menus", category: "Tech", price: 189_990, emoji: "🖥️", gradient: ["#2b0f3a", "#12081d"], popularity: 89, tags: ["pc", "gaming", "computer", "setup", "rtx"], image: u("photo-1593640408182-31c70c8268f5"), credit: UNSPLASH },
  // Fashion
  { id: "limited-sneakers", name: "Limited Sneakers", tagline: "Numbered. Never worn.", category: "Fashion", price: 24_999, emoji: "👟", gradient: ["#33230f", "#160f08"], popularity: 90, tags: ["shoes", "sneakers", "hype", "jordan"], image: u("photo-1542291026-7eec264c27ff"), credit: UNSPLASH },
  { id: "designer-jacket", name: "Designer Jacket", tagline: "Winter is an excuse", category: "Fashion", price: 47_500, emoji: "🧥", gradient: ["#103027", "#0a150f"], popularity: 66, tags: ["jacket", "fashion", "winter", "designer"], image: u("photo-1551028719-00167b16eac5"), credit: UNSPLASH },
  { id: "gold-chain", name: "22K Gold Chain", tagline: "Grandma approves", category: "Fashion", price: 210_000, emoji: "📿", gradient: ["#3a2c0a", "#181104"], popularity: 74, tags: ["gold", "chain", "jewellery", "luxury"], image: u("photo-1515562141207-7a88fb7ce338"), credit: UNSPLASH },
  // Cars
  { id: "superbike", name: "Superbike 1000RR", tagline: "Mid-life crisis, early", category: "Cars", price: 2_199_000, emoji: "🏍️", gradient: ["#301020", "#14070e"], popularity: 82, tags: ["bike", "motorcycle", "superbike", "ducati"], image: u("photo-1558981403-c5f9899a28bc"), credit: UNSPLASH },
  { id: "luxury-sedan", name: "German Luxury Sedan", tagline: "Chauffeur sold separately", category: "Cars", price: 6_200_000, emoji: "🚗", gradient: ["#101c33", "#080d18"], popularity: 87, tags: ["car", "bmw", "mercedes", "sedan", "luxury"], image: u("photo-1555215695-3004980ad54e"), credit: UNSPLASH },
  { id: "supercar", name: "Italian Supercar", tagline: "Louder than your opinions", category: "Cars", price: 31_000_000, emoji: "🏎️", gradient: ["#3a0d16", "#160409"], popularity: 93, tags: ["car", "lamborghini", "ferrari", "supercar", "dream"], image: u("photo-1544636331-e26879cd4d9b"), credit: UNSPLASH },
  // Food
  { id: "biryani-feast", name: "Royal Biryani Feast", tagline: "Serves 12. Feeds 2.", category: "Food", price: 2_499, emoji: "🍛", gradient: ["#33240c", "#171005"], popularity: 97, tags: ["biryani", "food", "feast", "hyderabadi"], image: u("photo-1563379091339-03b21ab4a4f8"), credit: UNSPLASH },
  { id: "sushi-night", name: "Chef's Sushi Night", tagline: "Wasabi has no mercy", category: "Food", price: 8_999, emoji: "🍣", gradient: ["#0d2b2a", "#05110f"], popularity: 72, tags: ["sushi", "japanese", "fine dining", "food"], image: u("photo-1579871494447-9811cf80d66c"), credit: UNSPLASH },
  { id: "gold-dessert", name: "Gold-Leaf Dessert", tagline: "An edible flex", category: "Food", price: 100_000, emoji: "🍰", gradient: ["#2e1a2e", "#130913"], popularity: 58, tags: ["dessert", "gold", "cake", "flex"], image: u("photo-1551024506-0bccd828d307"), credit: UNSPLASH },
  // Travel
  { id: "goa-weekend", name: "Goa Weekend Villa", tagline: "Work from beach, allegedly", category: "Travel", price: 45_000, emoji: "🏖️", gradient: ["#0c2d33", "#051215"], popularity: 86, tags: ["goa", "beach", "villa", "vacation"], image: u("photo-1512343879784-a960bf40e7f2"), credit: UNSPLASH },
  { id: "tokyo-business", name: "Business Class to Tokyo", tagline: "Lie-flat. Literally.", category: "Travel", price: 280_000, emoji: "✈️", gradient: ["#1a1233", "#0b0718"], popularity: 78, tags: ["japan", "tokyo", "flight", "business class"], image: u("photo-1436491865332-7a61a109cc05"), credit: UNSPLASH },
  { id: "maldives-week", name: "Maldives Overwater Week", tagline: "Blue on blue on blue", category: "Travel", price: 950_000, emoji: "🏝️", gradient: ["#08333d", "#03161a"], popularity: 91, tags: ["maldives", "island", "honeymoon", "vacation", "luxury"], image: u("photo-1514282401047-d79a71a590e8"), credit: UNSPLASH },
  // Flex
  { id: "vip-concert", name: "VIP Concert Box", tagline: "The artist waves at you", category: "Flex", price: 1_500_000, emoji: "🎤", gradient: ["#33102e", "#150614"], popularity: 80, tags: ["concert", "vip", "music", "experience"], image: u("photo-1470229722913-7c0e2dbbafd3"), credit: UNSPLASH },
  { id: "yacht-day", name: "Yacht Charter Day", tagline: "Sunsets included", category: "Flex", price: 1_200_000, emoji: "🛥️", gradient: ["#0a2740", "#04101c"], popularity: 76, tags: ["yacht", "boat", "luxury", "party"], image: u("photo-1567899378494-47b22a2ae96a"), credit: UNSPLASH },
  { id: "island-week", name: "Private Island Week", tagline: "Off-grid, on-brand", category: "Flex", price: 8_500_000, emoji: "🌴", gradient: ["#0d3320", "#04150c"], popularity: 88, tags: ["island", "private", "billionaire", "flex"], image: u("photo-1559128010-7c1ad6e1b6a5"), credit: UNSPLASH },
];

/** Top products by popularity — drives 🔥 Trending (plan §6) and search suggestions. */
export function trendingProducts(count = 8): Product[] {
  return [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, count);
}

export const POPULAR_THRESHOLD = 88;
