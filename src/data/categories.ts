import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "all", label: "All", icon: "LayoutGrid", count: 2400 },
  { id: "middle-eastern", label: "Middle Eastern", icon: "UtensilsCrossed", count: 412 },
  { id: "south-asian", label: "South Asian", icon: "Soup", count: 589 },
  { id: "turkish", label: "Turkish", icon: "Flame", count: 234 },
  { id: "american", label: "American Halal", icon: "Beef", count: 367 },
  { id: "japanese", label: "Japanese Halal", icon: "Fish", count: 89 },
  { id: "cafe", label: "Cafés", icon: "Coffee", count: 156 },
  { id: "fine-dining", label: "Fine Dining", icon: "Wine", count: 78 },
];

export const stats = [
  { label: "Halal spots listed", value: "2,400+" },
  { label: "Community reviews", value: "48K+" },
  { label: "Cities covered", value: "120+" },
  { label: "Verified certifications", value: "98%" },
];
