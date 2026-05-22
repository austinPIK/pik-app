// PIK App Mock Data

export type Tier = "free" | "explorer" | "elite";
export type TripStatus = "upcoming" | "active" | "completed" | "planning";
export type GearStatus = "own" | "buy" | "rent";
export type PaymentStatus = "paid" | "pending" | "overdue";
export type HostStatus = "draft" | "filling" | "confirmed" | "live" | "completed";
export type NotificationCategory = "trips" | "groups" | "hosts" | "pik" | "system";

export interface User {
  name: string;
  tier: Tier;
  avatar: string;
  location: string;
  followers: number;
  following: number;
  stats: {
    trips: number;
    countries: number;
    hosted: number;
    miles: number;
  };
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  paymentStatus: PaymentStatus;
  amount: number;
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  dates: { start: string; end: string };
  daysUntil: number;
  price: number;
  status: TripStatus;
  gradientFrom: string;
  gradientTo: string;
  gradientVia?: string;
  hotel: string;
  activities: string[];
  group: GroupMember[];
  description: string;
  nights: number;
}

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export interface GearItem {
  id: string;
  name: string;
  category: "apparel" | "gear" | "documents" | "tech" | "health";
  status: GearStatus;
  packed: boolean;
  assignedTo?: string;
}

export interface TravelDocument {
  id: string;
  type: "boarding-pass" | "hotel-voucher" | "activity-ticket" | "transport";
  title: string;
  subtitle: string;
  details: Record<string, string>;
  color: string;
}

export interface Memory {
  id: string;
  destination: string;
  country: string;
  date: string;
  photoCount: number;
  gradientFrom: string;
  gradientTo: string;
  gradientVia?: string;
  featured?: boolean;
  public?: boolean;
  likes: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "varix";
  content: string;
  time: string;
  tripCard?: {
    destination: string;
    hotel: string;
    price: number;
    nights: number;
    gradientFrom: string;
    gradientTo: string;
  };
}

export interface PricingTierFeature {
  label: string;
  included: boolean;
}

export interface PricingTier {
  id: Tier;
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  color: string;
  features: PricingTierFeature[];
  cta: string;
  popular?: boolean;
}

export interface HostTrip {
  id: string;
  destination: string;
  status: HostStatus;
  spotsTotal: number;
  spotsFilled: number;
  earnings: number;
  targetEarnings: number;
  dates: { start: string; end: string };
  gradientFrom: string;
  gradientTo: string;
  inviteCode: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const currentUser: User = {
  name: "Alex Rivera",
  tier: "explorer",
  avatar: "AR",
  location: "Miami, FL",
  followers: 1240,
  following: 387,
  stats: {
    trips: 12,
    countries: 8,
    hosted: 3,
    miles: 34200,
  },
};

export const groupMembers: GroupMember[] = [
  { id: "gm1", name: "Alex Rivera", avatar: "AR", paymentStatus: "paid", amount: 2400 },
  { id: "gm2", name: "Sofia Chen", avatar: "SC", paymentStatus: "paid", amount: 2400 },
  { id: "gm3", name: "Marcus Webb", avatar: "MW", paymentStatus: "pending", amount: 2400 },
  { id: "gm4", name: "Priya Nair", avatar: "PN", paymentStatus: "overdue", amount: 2400 },
  { id: "gm5", name: "Jordan Lee", avatar: "JL", paymentStatus: "paid", amount: 2400 },
];

export const trips: Trip[] = [
  {
    id: "t1",
    destination: "Bali",
    country: "Indonesia",
    dates: { start: "May 24, 2026", end: "Jun 3, 2026" },
    daysUntil: 12,
    price: 2400,
    status: "upcoming",
    gradientFrom: "#1a6b5a",
    gradientTo: "#0d3b4f",
    gradientVia: "#0f5040",
    hotel: "Alaya Resort Ubud",
    activities: ["Rice Terrace Trek", "Temple Tour", "Sunset Yoga", "Cooking Class"],
    group: groupMembers,
    description: "A transformative journey through Bali's spiritual heart — rice terraces, ancient temples, and pristine beaches await.",
    nights: 10,
  },
  {
    id: "t2",
    destination: "Kyoto",
    country: "Japan",
    dates: { start: "Jul 10, 2026", end: "Jul 20, 2026" },
    daysUntil: 59,
    price: 3200,
    status: "planning",
    gradientFrom: "#5b1a4a",
    gradientTo: "#2d0b3a",
    gradientVia: "#3d1245",
    hotel: "Nishiyama Onsen Keiunkan",
    activities: ["Cherry Blossom Walk", "Tea Ceremony", "Fushimi Inari", "Bamboo Grove"],
    group: [groupMembers[0], groupMembers[1], groupMembers[4]],
    description: "Experience the refined beauty of Japan's ancient capital — where tradition and tranquility intertwine.",
    nights: 10,
  },
  {
    id: "t3",
    destination: "Patagonia",
    country: "Argentina",
    dates: { start: "Sep 1, 2026", end: "Sep 12, 2026" },
    daysUntil: 112,
    price: 4100,
    status: "planning",
    gradientFrom: "#1a3a6b",
    gradientTo: "#0a1a40",
    gradientVia: "#1a2d5a",
    hotel: "Explora Patagonia",
    activities: ["Torres del Paine Trek", "Glacier Hike", "Kayaking", "Wildlife Safari"],
    group: [groupMembers[0], groupMembers[2]],
    description: "Raw, wild, and breathtaking — Patagonia's dramatic landscapes push the boundaries of adventure.",
    nights: 11,
  },
  {
    id: "t4",
    destination: "Santorini",
    country: "Greece",
    dates: { start: "Jun 15, 2025", end: "Jun 22, 2025" },
    daysUntil: -330,
    price: 2800,
    status: "completed",
    gradientFrom: "#4a2a1a",
    gradientTo: "#2a1a0a",
    gradientVia: "#3a2215",
    hotel: "Grace Hotel Santorini",
    activities: ["Sunset Cruise", "Wine Tasting", "Caldera View Hike"],
    group: [groupMembers[0], groupMembers[1]],
    description: "Classic Greek island magic — white-washed walls, infinite Aegean blue, and legendary sunsets.",
    nights: 7,
  },
  {
    id: "t5",
    destination: "Maldives",
    country: "Maldives",
    dates: { start: "Nov 5, 2026", end: "Nov 15, 2026" },
    daysUntil: 177,
    price: 5600,
    status: "planning",
    gradientFrom: "#0a4a5a",
    gradientTo: "#052a3a",
    gradientVia: "#0a3a4a",
    hotel: "COMO Maalifushi",
    activities: ["Snorkeling", "Overwater Bungalow", "Dolphin Cruise", "Spa"],
    group: [groupMembers[0], groupMembers[1]],
    description: "Ultimate luxury — overwater bungalows above crystal lagoons with house reefs at your doorstep.",
    nights: 10,
  },
  {
    id: "t6",
    destination: "Marrakech",
    country: "Morocco",
    dates: { start: "Feb 14, 2025", end: "Feb 21, 2025" },
    daysUntil: -450,
    price: 1900,
    status: "completed",
    gradientFrom: "#5a2a0a",
    gradientTo: "#3a1a05",
    gradientVia: "#4a2008",
    hotel: "La Mamounia",
    activities: ["Medina Tour", "Desert Camp", "Hammam Spa", "Cooking Class"],
    group: [groupMembers[0], groupMembers[3], groupMembers[4]],
    description: "Sensory overload in the best way — vibrant souks, ornate palaces, and Sahara stargazing.",
    nights: 7,
  },
];

export const notifications: Notification[] = [
  { id: "n1", category: "trips", title: "Flight Confirmed", message: "Your LAX → DPS flight has been confirmed. Check-in opens in 48h.", time: "2m ago", read: false, icon: "plane" },
  { id: "n2", category: "groups", title: "Marcus paid his share", message: "Marcus Webb paid $2,400 for Bali trip.", time: "1h ago", read: false, icon: "users" },
  { id: "n3", category: "pik", title: "New destinations added", message: "15 new golf destinations added in Southeast Asia.", time: "3h ago", read: false, icon: "map-pin" },
  { id: "n4", category: "hosts", title: "Spot filled!", message: "Your Kyoto trip has 4/6 spots filled. 2 remaining.", time: "5h ago", read: true, icon: "star" },
  { id: "n5", category: "trips", title: "Hotel check-in reminder", message: "Alaya Resort check-in is tomorrow at 3 PM.", time: "1d ago", read: true, icon: "building" },
  { id: "n6", category: "groups", title: "Priya is overdue", message: "Priya Nair's payment for Bali is 3 days overdue.", time: "2d ago", read: true, icon: "alert-circle" },
  { id: "n7", category: "pik", title: "Explorer perks updated", message: "New AI-generated itinerary feature available for you.", time: "3d ago", read: true, icon: "zap" },
  { id: "n8", category: "trips", title: "Kyoto visa reminder", message: "No visa required for US citizens staying under 90 days.", time: "4d ago", read: true, icon: "file-text" },
  { id: "n9", category: "hosts", title: "Review received", message: "Sofia Chen left you a 5-star review for the Marrakech trip.", time: "5d ago", read: true, icon: "star" },
  { id: "n10", category: "system", title: "Welcome to PIK Explorer", message: "Your Explorer subscription is active. Unlock all premium features.", time: "1w ago", read: true, icon: "check-circle" },
];

export const gearItems: GearItem[] = [
  { id: "g1", name: "Passport", category: "documents", status: "own", packed: true, assignedTo: "Alex Rivera" },
  { id: "g2", name: "Travel Insurance Docs", category: "documents", status: "own", packed: true, assignedTo: "Alex Rivera" },
  { id: "g3", name: "Visa Copy", category: "documents", status: "own", packed: false, assignedTo: "Alex Rivera" },
  { id: "g4", name: "Lightweight Hiking Boots", category: "apparel", status: "own", packed: true, assignedTo: "Alex Rivera" },
  { id: "g5", name: "Moisture-wicking Shirts (x3)", category: "apparel", status: "own", packed: false, assignedTo: "Alex Rivera" },
  { id: "g6", name: "Rain Jacket", category: "apparel", status: "buy", packed: false },
  { id: "g7", name: "Sun Hat", category: "apparel", status: "own", packed: true, assignedTo: "Sofia Chen" },
  { id: "g8", name: "Swimwear (x2)", category: "apparel", status: "own", packed: true, assignedTo: "Alex Rivera" },
  { id: "g9", name: "Drone (DJI Mini 4)", category: "tech", status: "own", packed: true, assignedTo: "Marcus Webb" },
  { id: "g10", name: "Power Bank 20000mAh", category: "tech", status: "own", packed: false, assignedTo: "Alex Rivera" },
  { id: "g11", name: "Universal Power Adapter", category: "tech", status: "buy", packed: false },
  { id: "g12", name: "Mirrorless Camera", category: "tech", status: "rent", packed: false, assignedTo: "Sofia Chen" },
  { id: "g13", name: "Noise-Cancelling Headphones", category: "tech", status: "own", packed: true, assignedTo: "Alex Rivera" },
  { id: "g14", name: "Trekking Poles", category: "gear", status: "rent", packed: false },
  { id: "g15", name: "Day Pack 20L", category: "gear", status: "own", packed: true, assignedTo: "Alex Rivera" },
  { id: "g16", name: "Water Purifier Bottle", category: "gear", status: "buy", packed: false },
  { id: "g17", name: "Malaria Tablets", category: "health", status: "buy", packed: false, assignedTo: "Priya Nair" },
  { id: "g18", name: "First Aid Kit", category: "health", status: "own", packed: true, assignedTo: "Marcus Webb" },
  { id: "g19", name: "Sunscreen SPF 50 (x2)", category: "health", status: "own", packed: true, assignedTo: "Alex Rivera" },
  { id: "g20", name: "Insect Repellent", category: "health", status: "buy", packed: false, assignedTo: "Sofia Chen" },
];

export const documents: TravelDocument[] = [
  {
    id: "d1",
    type: "boarding-pass",
    title: "Boarding Pass",
    subtitle: "LAX to DPS",
    color: "#4DA3FF",
    details: {
      passenger: "Alex Rivera",
      flight: "GA 847",
      gate: "B22",
      seat: "14A",
      class: "Business",
      departure: "May 24, 08:40",
      arrival: "May 25, 17:25",
    },
  },
  {
    id: "d2",
    type: "hotel-voucher",
    title: "Hotel Voucher",
    subtitle: "Alaya Resort Ubud",
    color: "#8B5CFF",
    details: {
      guest: "Alex Rivera",
      checkIn: "May 25, 2026",
      checkOut: "Jun 2, 2026",
      room: "Pool Villa King",
      confirmation: "ALY-24-98342",
      board: "Breakfast Included",
    },
  },
  {
    id: "d3",
    type: "activity-ticket",
    title: "Activity Ticket",
    subtitle: "Tegallalang Rice Terrace Trek",
    color: "#D946EF",
    details: {
      guest: "Alex Rivera (+4)",
      date: "May 27, 2026",
      time: "07:00 AM",
      duration: "4 hours",
      meeting: "Alaya Resort Lobby",
      guide: "Wayan Artana",
    },
  },
  {
    id: "d4",
    type: "transport",
    title: "Transport",
    subtitle: "Airport Transfer DPS to Ubud",
    color: "#1a6b5a",
    details: {
      passenger: "Alex Rivera (+4)",
      pickup: "Ngurah Rai Airport Terminal 3",
      dropoff: "Alaya Resort Ubud",
      date: "May 25, 2026",
      time: "18:00",
      vehicle: "Toyota Hiace (7-seater)",
      driver: "Ketut Sudana",
    },
  },
];

export const memories: Memory[] = [
  { id: "m1", destination: "Bali", country: "Indonesia", date: "Jun 2025", photoCount: 248, gradientFrom: "#1a6b5a", gradientTo: "#0d3b4f", featured: true, public: true, likes: 142 },
  { id: "m2", destination: "Santorini", country: "Greece", date: "Jun 2025", photoCount: 183, gradientFrom: "#4a2a1a", gradientTo: "#2a1a0a", public: true, likes: 97 },
  { id: "m3", destination: "Marrakech", country: "Morocco", date: "Feb 2025", photoCount: 312, gradientFrom: "#5a2a0a", gradientTo: "#3a1a05", public: false, likes: 0 },
  { id: "m4", destination: "Tokyo", country: "Japan", date: "Nov 2024", photoCount: 421, gradientFrom: "#2a1a5a", gradientTo: "#1a0a3a", public: true, likes: 218 },
  { id: "m5", destination: "New York", country: "USA", date: "Dec 2024", photoCount: 156, gradientFrom: "#1a3a1a", gradientTo: "#0a1a0a", public: true, likes: 63 },
  { id: "m6", destination: "Dubai", country: "UAE", date: "Jan 2025", photoCount: 289, gradientFrom: "#3a2a0a", gradientTo: "#2a1a05", public: true, likes: 175 },
  { id: "m7", destination: "Iceland", country: "Iceland", date: "Mar 2025", photoCount: 198, gradientFrom: "#0a2a4a", gradientTo: "#052030", public: false, likes: 0 },
  { id: "m8", destination: "Cape Town", country: "South Africa", date: "Apr 2025", photoCount: 267, gradientFrom: "#4a1a2a", gradientTo: "#2a0a1a", public: true, likes: 89 },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "cm1",
    role: "user",
    content: "I want to plan a luxury trip to Southeast Asia for late May with 4 friends. Budget around $3,000 per person.",
    time: "10:32 AM",
  },
  {
    id: "cm2",
    role: "varix",
    content: "Perfect timing — Bali in late May sits just outside peak season with lush landscapes and fewer crowds. I've curated something exceptional for your group.",
    time: "10:32 AM",
    tripCard: {
      destination: "Bali, Indonesia",
      hotel: "Alaya Resort Ubud",
      price: 2400,
      nights: 10,
      gradientFrom: "#1a6b5a",
      gradientTo: "#0d3b4f",
    },
  },
  {
    id: "cm3",
    role: "user",
    content: "That looks amazing. What about activities for the group?",
    time: "10:34 AM",
  },
  {
    id: "cm4",
    role: "varix",
    content: "For your group of 5, I recommend a private rice terrace trek at sunrise, a cooking class at a local family compound, and a temple circuit finishing at Tanah Lot for the sunset. I can book all three with a single tap.",
    time: "10:34 AM",
  },
  {
    id: "cm5",
    role: "user",
    content: "Yes, book it! Also, can you check if there are any golf courses nearby?",
    time: "10:36 AM",
  },
  {
    id: "cm6",
    role: "varix",
    content: "New Kuta Golf Club offers spectacular clifftop ocean views — rated #1 in Bali. I can secure a tee time for your group on May 28th. This is a Golf Intelligence feature available with Elite.",
    time: "10:36 AM",
  },
];

export const hostTrips: HostTrip[] = [
  {
    id: "ht1",
    destination: "Kyoto, Japan",
    status: "filling",
    spotsTotal: 8,
    spotsFilled: 5,
    earnings: 620,
    targetEarnings: 1000,
    dates: { start: "Jul 10, 2026", end: "Jul 20, 2026" },
    gradientFrom: "#5b1a4a",
    gradientTo: "#2d0b3a",
    inviteCode: "KYOTO-2026-RIV",
  },
  {
    id: "ht2",
    destination: "Bali, Indonesia",
    status: "confirmed",
    spotsTotal: 6,
    spotsFilled: 6,
    earnings: 480,
    targetEarnings: 480,
    dates: { start: "May 24, 2026", end: "Jun 3, 2026" },
    gradientFrom: "#1a6b5a",
    gradientTo: "#0d3b4f",
    inviteCode: "BALI-2026-RIV",
  },
  {
    id: "ht3",
    destination: "Patagonia, Argentina",
    status: "draft",
    spotsTotal: 10,
    spotsFilled: 0,
    earnings: 0,
    targetEarnings: 1400,
    dates: { start: "Sep 1, 2026", end: "Sep 12, 2026" },
    gradientFrom: "#1a3a6b",
    gradientTo: "#0a1a40",
    inviteCode: "PATA-2026-RIV",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Start exploring with the basics",
    color: "#9BA3B7",
    cta: "Get Started",
    features: [
      { label: "Browse destinations", included: true },
      { label: "Basic trip planning", included: true },
      { label: "Up to 2 trips", included: true },
      { label: "Group trips (up to 4)", included: true },
      { label: "AI trip suggestions", included: false },
      { label: "Wallet and documents", included: false },
      { label: "AI gear packing list", included: false },
      { label: "Host trips and earn", included: false },
      { label: "Golf intelligence", included: false },
      { label: "Concierge support", included: false },
    ],
  },
  {
    id: "explorer",
    name: "Explorer",
    price: { monthly: 19, annual: 14 },
    description: "For the serious traveler who wants more",
    color: "#4DA3FF",
    cta: "Start Exploring",
    popular: true,
    features: [
      { label: "Everything in Free", included: true },
      { label: "Unlimited trips", included: true },
      { label: "AI trip planning (Varix)", included: true },
      { label: "Wallet and travel documents", included: true },
      { label: "AI gear packing list", included: true },
      { label: "Host trips and earn credits", included: true },
      { label: "Group up to 12 members", included: true },
      { label: "Live trip status tracking", included: true },
      { label: "Golf intelligence", included: false },
      { label: "Concierge support", included: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: { monthly: 49, annual: 39 },
    description: "White-glove travel for the discerning few",
    color: "#D946EF",
    cta: "Go Elite",
    features: [
      { label: "Everything in Explorer", included: true },
      { label: "Golf intelligence and handicap", included: true },
      { label: "24/7 concierge support", included: true },
      { label: "Priority hotel upgrades", included: true },
      { label: "Exclusive Elite destinations", included: true },
      { label: "Advanced analytics dashboard", included: true },
      { label: "Unlimited group members", included: true },
      { label: "Early access to new features", included: true },
      { label: "Custom trip branding", included: true },
      { label: "Dedicated travel manager", included: true },
    ],
  },
];

export const communityMemories: Memory[] = [
  { id: "cma1", destination: "Amalfi Coast", country: "Italy", date: "May 2025", photoCount: 192, gradientFrom: "#1a4a6b", gradientTo: "#0a2a40", public: true, likes: 341 },
  { id: "cma2", destination: "Phuket", country: "Thailand", date: "Apr 2025", photoCount: 274, gradientFrom: "#0a5a3a", gradientTo: "#052a1a", public: true, likes: 218 },
  { id: "cma3", destination: "Lisbon", country: "Portugal", date: "Mar 2025", photoCount: 147, gradientFrom: "#4a3a1a", gradientTo: "#2a2a0a", public: true, likes: 156 },
  { id: "cma4", destination: "Queenstown", country: "New Zealand", date: "Feb 2025", photoCount: 388, gradientFrom: "#2a1a5a", gradientTo: "#1a0a3a", public: true, likes: 492 },
];
