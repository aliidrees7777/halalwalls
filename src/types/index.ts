export type CuisineType =
  | "Middle Eastern"
  | "South Asian"
  | "Turkish"
  | "Malaysian"
  | "American Halal"
  | "Mediterranean"
  | "Japanese Halal"
  | "African";

export type CertificationLevel = "Certified" | "Muslim-Owned" | "Halal Menu" | "Verified";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: CuisineType;
  certification: CertificationLevel;
  rating: number;
  reviewCount: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  address: string;
  city: string;
  distance: string;
  image: string;
  tags: string[];
  featured?: boolean;
  openNow?: boolean;
  description: string;
  hours: string;
  phone: string;
  highlights: string[];
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  restaurant?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  count: number;
}
