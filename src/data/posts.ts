import type { CommunityPost } from "@/types";

export const communityPosts: CommunityPost[] = [
  {
    id: "1",
    author: {
      name: "Amina Hassan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      handle: "@aminah_eats",
    },
    restaurant: "Saffron & Spice",
    content:
      "Finally tried the lamb mansaf here — absolutely incredible. The portion size is generous and the staff confirmed all meat is hand-slaughtered zabiha. Will be back this weekend!",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80",
    likes: 234,
    comments: 42,
    timestamp: "2h ago",
    tags: ["Review", "Chicago"],
  },
  {
    id: "2",
    author: {
      name: "Omar Farouk",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      handle: "@omar_explores",
    },
    content:
      "Pro tip for anyone visiting Dearborn: Nūr Grill House has the best Adana kebab on this side of Istanbul. Get there before 7pm or expect a wait.",
    likes: 189,
    comments: 28,
    timestamp: "5h ago",
    tags: ["Tip", "Michigan"],
  },
  {
    id: "3",
    author: {
      name: "Fatima Rahman",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      handle: "@fatima_foodie",
    },
    restaurant: "Tokyo Halal Ramen",
    content:
      "As someone who lived in Tokyo for 3 years, I can confirm this is legit halal ramen. The broth depth is unreal. Pair with the gyoza — you won't regret it.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    likes: 412,
    comments: 67,
    timestamp: "8h ago",
    tags: ["Review", "LA"],
  },
  {
    id: "4",
    author: {
      name: "Yusuf Malik",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      handle: "@yusuf_halal",
    },
    content:
      "Looking for halal brunch spots in Toronto — any recommendations? Preferably with good coffee and a quiet atmosphere for studying.",
    likes: 56,
    comments: 89,
    timestamp: "12h ago",
    tags: ["Question", "Toronto"],
  },
  {
    id: "5",
    author: {
      name: "Layla Ahmed",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
      handle: "@layla_plates",
    },
    restaurant: "Bismillah Biryani Co.",
    content:
      "Friday biryani drop at Bismillah is a ritual in our family now. The raita and mirchi ka salan are perfect. Cash only on weekends FYI!",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    likes: 178,
    comments: 31,
    timestamp: "1d ago",
    tags: ["Family", "Houston"],
  },
  {
    id: "6",
    author: {
      name: "Ibrahim Noor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
      handle: "@ibrahim_eats",
    },
    content:
      "Just discovered HalalWalls and it's a game changer for travel. Found 3 certified spots near my hotel in Atlanta in under 5 minutes. JazakAllah khair to the team!",
    likes: 95,
    comments: 14,
    timestamp: "1d ago",
    tags: ["Appreciation"],
  },
];
