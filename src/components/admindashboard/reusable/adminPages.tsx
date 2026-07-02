"use client";
/* eslint-disable @next/next/no-img-element -- small admin thumbnails, plain <img> is fine */
import {
  Monitor,
  PlayCircle,
  Eye,
  MousePointerClick,
  TrendingUp,
  LayoutGrid,
  Image as ImageIcon,
  Download,
  Star,
  FolderOpen,
  CheckCircle2,
  Tag as TagIcon,
  Clock,
  XCircle,
} from "lucide-react";
import { StatusBadge } from "./cells";
import type { ListPageConfig, Row } from "./types";

/* ── small reusable cell renderers ─────────────────────────────────────── */
const thumb = (url: string) => (
  <img src={url} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
);

const titleSub = (title: string, sub: string) => (
  <div className="min-w-0">
    <div className="truncate font-medium text-[var(--text)]">{title}</div>
    <div className="truncate text-xs text-[var(--text2)]">{sub}</div>
  </div>
);

const dateTime = (date: string, time: string) => (
  <div>
    <div className="text-[var(--text)]">{date}</div>
    <div className="text-xs text-[var(--text2)]">{time}</div>
  </div>
);

const pill = (text: string, cls = "bg-[var(--bg3)] text-[var(--text)]") => (
  <span className={`inline-flex rounded-md px-2 py-0.5 text-xs ${cls}`}>{text}</span>
);

const avatar = (name: string, email: string) => (
  <div className="flex items-center gap-2">
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--brand-dim)] text-xs font-semibold text-[var(--brand)]">
      {name.slice(0, 2).toUpperCase()}
    </span>
    <div className="min-w-0">
      <div className="truncate text-[var(--text)]">{name}</div>
      <div className="truncate text-xs text-[var(--text2)]">{email}</div>
    </div>
  </div>
);

const STATUS_FILTER = {
  key: "status",
  placeholder: "All Status",
  options: [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Paused", value: "Paused" },
  ],
};

/* ── Ads ───────────────────────────────────────────────────────────────── */
const ads: ListPageConfig = {
  title: "Ads",
  breadcrumb: ["Dashboard", "Ads"],
  primaryAction: { label: "Create Ad" },
  showIndex: true,
  searchPlaceholder: "Search ads…",
  searchKeys: ["title", "adId", "location", "type"],
  rowId: (r) => String(r.adId),
  stats: [
    { label: "Total Ads", value: "32", sub: "+5 this month", icon: <Monitor size={18} /> },
    { label: "Active Ads", value: "24", sub: "75% of total", icon: <PlayCircle size={18} /> },
    { label: "Total Impressions", value: "12.45M", sub: "+18.6% this month", icon: <Eye size={18} /> },
    { label: "Total Clicks", value: "256.8K", sub: "+12.4% this month", icon: <MousePointerClick size={18} /> },
    { label: "CTR", value: "2.06%", sub: "+0.15% this month", icon: <TrendingUp size={18} /> },
  ],
  filters: [
    { key: "location", placeholder: "All Locations", options: ["Sidebar", "Header", "Popup", "Footer", "Content Top"].map((v) => ({ label: v, value: v })) },
    { key: "type", placeholder: "All Types", options: ["Image", "HTML"].map((v) => ({ label: v, value: v })) },
    STATUS_FILTER,
  ],
  sortOptions: [{ label: "Newest", value: "newest" }, { label: "Oldest", value: "oldest" }],
  actions: [
    { type: "edit" },
    { type: "toggle", isActive: (r) => r.status === "Active" },
    { type: "delete" },
    { type: "more" },
  ],
  columns: [
    { key: "preview", header: "Preview", cell: (r) => thumb(String(r.preview)) },
    { key: "title", header: "Title", cell: (r) => titleSub(String(r.title), String(r.adId)) },
    { key: "location", header: "Location", cell: (r) => pill(String(r.location)) },
    { key: "type", header: "Type" },
    { key: "targeting", header: "Targeting" },
    { key: "impressions", header: "Impressions", align: "right" },
    { key: "clicks", header: "Clicks", align: "right" },
    { key: "ctr", header: "CTR", align: "right" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge value={String(r.status)} /> },
    { key: "created", header: "Created", cell: (r) => dateTime(String(r.created), String(r.createdTime)) },
  ],
  data: [
    { preview: "https://picsum.photos/seed/ad1/56/40", title: "Premium Upgrade", adId: "#ad-premium-01", location: "Sidebar", type: "Image", targeting: "All Users", impressions: "2.45M", clicks: "68.4K", ctr: "2.79%", status: "Active", created: "May 15, 2025", createdTime: "10:30 AM" },
    { preview: "https://picsum.photos/seed/ad2/56/40", title: "Mobile App Promo", adId: "#ad-app-02", location: "Header", type: "Image", targeting: "All Users", impressions: "1.89M", clicks: "45.2K", ctr: "2.39%", status: "Active", created: "May 14, 2025", createdTime: "09:15 AM" },
    { preview: "https://picsum.photos/seed/ad3/56/40", title: "50% Off Yearly Plan", adId: "#ad-discount-03", location: "Popup", type: "Image", targeting: "Non-Premium Users", impressions: "1.23M", clicks: "32.1K", ctr: "2.61%", status: "Active", created: "May 13, 2025", createdTime: "08:20 AM" },
    { preview: "https://picsum.photos/seed/ad4/56/40", title: "Adobe Stock", adId: "#ad-adobe-04", location: "Footer", type: "Image", targeting: "All Users", impressions: "980K", clicks: "18.7K", ctr: "1.91%", status: "Active", created: "May 12, 2025", createdTime: "06:45 AM" },
    { preview: "https://picsum.photos/seed/ad5/56/40", title: "Envato Elements", adId: "#ad-envato-05", location: "Sidebar", type: "Image", targeting: "All Users", impressions: "850K", clicks: "14.3K", ctr: "1.68%", status: "Paused", created: "May 11, 2025", createdTime: "11:30 AM" },
    { preview: "https://picsum.photos/seed/ad6/56/40", title: "Custom Ad Slot", adId: "#ad-custom-06", location: "Content Top", type: "HTML", targeting: "All Users", impressions: "623K", clicks: "9.8K", ctr: "1.57%", status: "Inactive", created: "May 10, 2025", createdTime: "04:10 PM" },
  ],
};

/* ── Categories ────────────────────────────────────────────────────────── */
const categories: ListPageConfig = {
  title: "Categories",
  breadcrumb: ["Dashboard", "Categories"],
  primaryAction: { label: "Add Category" },
  showIndex: true,
  searchPlaceholder: "Search categories…",
  searchKeys: ["category", "description"],
  rowId: (r) => String(r.category),
  stats: [
    { label: "Total Categories", value: "24", sub: "+3 this month", icon: <LayoutGrid size={18} /> },
    { label: "Active Categories", value: "21", sub: "87.5% of total", icon: <ImageIcon size={18} /> },
    { label: "Total Wallpapers", value: "8,642", sub: "Across all categories", icon: <Eye size={18} /> },
    { label: "Total Downloads", value: "2.45M", sub: "Across all categories", icon: <Download size={18} /> },
    { label: "Most Popular", value: "Islamic", sub: "1.24M downloads", icon: <Star size={18} />, accent: "#f59e0b" },
  ],
  filters: [STATUS_FILTER],
  sortOptions: [{ label: "Newest", value: "newest" }, { label: "Most Wallpapers", value: "wallpapers" }],
  actions: [{ type: "edit" }, { type: "delete" }, { type: "more" }],
  columns: [
    { key: "category", header: "Category", cell: (r) => (
      <div className="flex items-center gap-3">{thumb(String(r.image))}<span className="font-medium text-[var(--text)]">{String(r.category)}</span></div>
    ) },
    { key: "description", header: "Description", cell: (r) => <span className="text-[var(--text2)]">{String(r.description)}</span> },
    { key: "wallpapers", header: "Wallpapers", align: "right" },
    { key: "downloads", header: "Downloads", align: "right" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge value={String(r.status)} /> },
    { key: "created", header: "Created" },
  ],
  data: [
    { image: "https://picsum.photos/seed/cat1/56/40", category: "Islamic", description: "Mosques, calligraphy and Islamic art.", wallpapers: "1,245", downloads: "1.24M", status: "Active", created: "May 15, 2025" },
    { image: "https://picsum.photos/seed/cat2/56/40", category: "Anime", description: "High quality anime wallpapers for fans.", wallpapers: "1,198", downloads: "856.2K", status: "Active", created: "May 14, 2025" },
    { image: "https://picsum.photos/seed/cat3/56/40", category: "Nature", description: "Nature, landscapes, mountains and lakes.", wallpapers: "1,156", downloads: "654.1K", status: "Active", created: "May 13, 2025" },
    { image: "https://picsum.photos/seed/cat4/56/40", category: "Superheroes", description: "Superhero wallpapers from Marvel, DC.", wallpapers: "1,089", downloads: "742.7K", status: "Active", created: "May 12, 2025" },
    { image: "https://picsum.photos/seed/cat5/56/40", category: "Cars", description: "Supercars, bikes and automotive.", wallpapers: "742", downloads: "401.9K", status: "Inactive", created: "May 9, 2025" },
  ],
};

/* ── Resolutions (no image column) ─────────────────────────────────────── */
const resolutions: ListPageConfig = {
  title: "Resolutions",
  breadcrumb: ["Dashboard", "Resolutions"],
  primaryAction: { label: "Add Resolution" },
  searchPlaceholder: "Search resolutions…",
  searchKeys: ["resolution", "aspect"],
  rowId: (r) => String(r.resolution),
  stats: [
    { label: "Total Resolutions", value: "27", sub: "+2 this month", icon: <Monitor size={18} /> },
    { label: "Active Resolutions", value: "25", sub: "92.6% of total", icon: <ImageIcon size={18} /> },
    { label: "Total Downloads", value: "256.84M", sub: "Across all resolutions", icon: <Download size={18} /> },
    { label: "Wallpapers Assigned", value: "11,539", sub: "With at least one resolution", icon: <FolderOpen size={18} /> },
    { label: "Most Popular", value: "3840x2160", sub: "128.4M downloads", icon: <TrendingUp size={18} />, accent: "#f59e0b" },
  ],
  filters: [STATUS_FILTER],
  sortOptions: [{ label: "Width (High to Low)", value: "width" }, { label: "Newest", value: "newest" }],
  actions: [{ type: "edit" }, { type: "delete" }, { type: "more" }],
  columns: [
    { key: "resolution", header: "Resolution", cell: (r) => <span className="font-medium text-[var(--text)]">{String(r.resolution)}</span> },
    { key: "aspect", header: "Aspect Ratio" },
    { key: "wallpapers", header: "Wallpapers", align: "right" },
    { key: "downloads", header: "Downloads", align: "right" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge value={String(r.status)} /> },
    { key: "created", header: "Created" },
  ],
  data: [
    { resolution: "7680 x 4320 (8K UHD)", aspect: "16:9", wallpapers: "1,245", downloads: "18.42M", status: "Active", created: "May 15, 2025" },
    { resolution: "5120 x 2880 (5K)", aspect: "16:9", wallpapers: "987", downloads: "14.28M", status: "Active", created: "May 15, 2025" },
    { resolution: "3840 x 2160 (4K UHD)", aspect: "16:9", wallpapers: "4,562", downloads: "128.40M", status: "Active", created: "Apr 20, 2025" },
    { resolution: "2560 x 1440 (QHD)", aspect: "16:9", wallpapers: "2,134", downloads: "32.65M", status: "Active", created: "Apr 16, 2025" },
    { resolution: "1920 x 1080 (Full HD)", aspect: "16:9", wallpapers: "3,245", downloads: "41.28M", status: "Active", created: "Apr 10, 2025" },
    { resolution: "1366 x 768 (HD)", aspect: "16:9", wallpapers: "185", downloads: "1.12M", status: "Inactive", created: "Apr 5, 2025" },
  ],
};

/* ── Tags (coloured tag badge, no image) ───────────────────────────────── */
const TAG_COLORS: Record<string, string> = {
  nature: "bg-[#34d399]/15 text-[#34d399]",
  anime: "bg-[#a78bfa]/15 text-[#a78bfa]",
  islamic: "bg-[#34d399]/15 text-[#34d399]",
  minimalist: "bg-[#60a5fa]/15 text-[#60a5fa]",
  night: "bg-[#818cf8]/15 text-[#818cf8]",
  gaming: "bg-[#f87171]/15 text-[#f87171]",
  cars: "bg-[#fb923c]/15 text-[#fb923c]",
  space: "bg-[#60a5fa]/15 text-[#60a5fa]",
  city: "bg-[#2dd4bf]/15 text-[#2dd4bf]",
  abstract: "bg-[#facc15]/15 text-[#facc15]",
};
const tags: ListPageConfig = {
  title: "Tags",
  breadcrumb: ["Dashboard", "Tags"],
  primaryAction: { label: "Add Tag" },
  searchPlaceholder: "Search tags…",
  searchKeys: ["tag", "description"],
  rowId: (r) => String(r.tag),
  stats: [
    { label: "Total Tags", value: "156", sub: "+12 this month", icon: <TagIcon size={18} /> },
    { label: "Active Tags", value: "142", sub: "91.0% of total", icon: <CheckCircle2 size={18} /> },
    { label: "Total Wallpapers", value: "11,539", sub: "Tagged with all", icon: <Eye size={18} /> },
    { label: "Total Downloads", value: "356.42K", sub: "Across all tags", icon: <Download size={18} /> },
    { label: "Most Used Tag", value: "#nature", sub: "8,421 wallpapers", icon: <TrendingUp size={18} />, accent: "#f59e0b" },
  ],
  filters: [STATUS_FILTER],
  sortOptions: [{ label: "Newest", value: "newest" }, { label: "Most Used", value: "used" }],
  actions: [{ type: "edit" }, { type: "delete" }, { type: "more" }],
  columns: [
    { key: "tag", header: "Tag", cell: (r) => {
      const key = String(r.tag).replace("#", "").toLowerCase();
      return <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${TAG_COLORS[key] ?? "bg-[var(--bg3)] text-[var(--text)]"}`}>{String(r.tag)}</span>;
    } },
    { key: "description", header: "Description", cell: (r) => <span className="text-[var(--text2)]">{String(r.description)}</span> },
    { key: "wallpapers", header: "Wallpapers", align: "right" },
    { key: "downloads", header: "Downloads", align: "right" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge value={String(r.status)} /> },
    { key: "created", header: "Created" },
  ],
  data: [
    { tag: "#nature", description: "Nature, landscapes, mountains, lakes.", wallpapers: "1,245", downloads: "42,581", status: "Active", created: "May 15, 2025" },
    { tag: "#anime", description: "Anime characters, scenes and art.", wallpapers: "1,198", downloads: "38,742", status: "Active", created: "May 14, 2025" },
    { tag: "#islamic", description: "Islamic art, calligraphy and mosques.", wallpapers: "986", downloads: "31,256", status: "Active", created: "May 13, 2025" },
    { tag: "#minimalist", description: "Minimal and clean wallpapers.", wallpapers: "874", downloads: "24,913", status: "Active", created: "May 12, 2025" },
    { tag: "#gaming", description: "Gaming, eSports, consoles and art.", wallpapers: "653", downloads: "19,876", status: "Active", created: "May 10, 2025" },
    { tag: "#city", description: "Cityscapes, buildings and skylines.", wallpapers: "587", downloads: "15,763", status: "Inactive", created: "May 7, 2025" },
  ],
};

/* ── Wallpapers ────────────────────────────────────────────────────────── */
const CAT_PILL: Record<string, string> = {
  Nature: "bg-[#34d399]/15 text-[#34d399]",
  Gaming: "bg-[#a78bfa]/15 text-[#a78bfa]",
  Minimalist: "bg-[#60a5fa]/15 text-[#60a5fa]",
  Islamic: "bg-[#34d399]/15 text-[#34d399]",
  Cars: "bg-[#facc15]/15 text-[#facc15]",
  Space: "bg-[#818cf8]/15 text-[#818cf8]",
  Anime: "bg-[#f472b6]/15 text-[#f472b6]",
};
const wallpapers: ListPageConfig = {
  title: "Wallpapers",
  breadcrumb: ["Dashboard", "Wallpapers"],
  primaryAction: { label: "Add Wallpaper" },
  searchPlaceholder: "Search wallpapers by title, uploader…",
  searchKeys: ["title", "uploader", "email", "category"],
  rowId: (r) => String(r.title) + String(r.uploaded),
  stats: [
    { label: "Total Wallpapers", value: "11,539", trend: { text: "+12.5%", dir: "up" }, icon: <ImageIcon size={18} /> },
    { label: "Approved", value: "9,812", trend: { text: "+10.3%", dir: "up" }, icon: <CheckCircle2 size={18} /> },
    { label: "Pending Review", value: "642", trend: { text: "-4.2%", dir: "down" }, icon: <Clock size={18} />, accent: "#f59e0b" },
    { label: "Rejected", value: "1,085", trend: { text: "+3.7%", dir: "up" }, icon: <XCircle size={18} />, accent: "#f87171" },
    { label: "Total Downloads", value: "356,421", trend: { text: "+10.2%", dir: "up" }, icon: <Download size={18} /> },
  ],
  filters: [
    { key: "category", placeholder: "All Categories", options: ["Nature", "Gaming", "Minimalist", "Islamic", "Cars", "Space", "Anime"].map((v) => ({ label: v, value: v })) },
    { key: "resolution", placeholder: "All Resolutions", options: ["3840×2160", "1920×1080"].map((v) => ({ label: v, value: v })) },
    { key: "status", placeholder: "All Status", options: ["Approved", "Pending", "Rejected"].map((v) => ({ label: v, value: v })) },
  ],
  sortOptions: [{ label: "Newest", value: "newest" }, { label: "Most Downloads", value: "downloads" }],
  actions: [{ type: "view" }, { type: "edit" }, { type: "delete" }, { type: "more" }],
  columns: [
    { key: "preview", header: "Preview", cell: (r) => thumb(String(r.preview)) },
    { key: "title", header: "Title", cell: (r) => titleSub(String(r.title), String(r.tags)) },
    { key: "uploader", header: "Uploader", cell: (r) => avatar(String(r.uploader), String(r.email)) },
    { key: "category", header: "Category", cell: (r) => pill(String(r.category), CAT_PILL[String(r.category)] ?? "bg-[var(--bg3)] text-[var(--text)]") },
    { key: "resolution", header: "Resolution" },
    { key: "downloads", header: "Downloads", align: "right" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge value={String(r.status)} /> },
    { key: "uploaded", header: "Uploaded", cell: (r) => dateTime(String(r.uploaded), String(r.uploadedTime)) },
  ],
  data: [
    { preview: "https://picsum.photos/seed/wp1/56/40", title: "Sunset in Tokyo", tags: "#city #sunset", uploader: "ahmed.khan", email: "ahmed@email.com", category: "Nature", resolution: "3840×2160", downloads: "12,345", status: "Approved", uploaded: "May 15, 2025", uploadedTime: "10:30 AM" },
    { preview: "https://picsum.photos/seed/wp2/56/40", title: "Cyberpunk City 2077", tags: "#cyberpunk #4k", uploader: "tech.lord", email: "techlord@email.com", category: "Gaming", resolution: "3840×2160", downloads: "8,976", status: "Approved", uploaded: "May 15, 2025", uploadedTime: "09:15 AM" },
    { preview: "https://picsum.photos/seed/wp3/56/40", title: "Minimalist Mountains", tags: "#minimalist #mountain", uploader: "sara.art", email: "saraart@email.com", category: "Minimalist", resolution: "3840×2160", downloads: "5,421", status: "Pending", uploaded: "May 14, 2025", uploadedTime: "11:45 PM" },
    { preview: "https://picsum.photos/seed/wp4/56/40", title: "Islamic Pattern Art", tags: "#islamic #pattern", uploader: "islamic.designs", email: "islamic@email.com", category: "Islamic", resolution: "3840×2160", downloads: "3,782", status: "Approved", uploaded: "May 14, 2025", uploadedTime: "08:20 PM" },
    { preview: "https://picsum.photos/seed/wp5/56/40", title: "Deep Space", tags: "#space #planet", uploader: "space.explorer", email: "space@email.com", category: "Space", resolution: "3840×2160", downloads: "6,231", status: "Rejected", uploaded: "May 13, 2025", uploadedTime: "04:30 PM" },
    { preview: "https://picsum.photos/seed/wp6/56/40", title: "Anime Character", tags: "#anime #character", uploader: "anime.world", email: "anime@email.com", category: "Anime", resolution: "1920×1080", downloads: "4,561", status: "Pending", uploaded: "May 13, 2025", uploadedTime: "02:15 PM" },
  ],
};

/** Sidebar item name → page config. */
export const ADMIN_PAGES: Record<string, ListPageConfig<Row>> = {
  Ads: ads,
  Categories: categories,
  Resolutions: resolutions,
  Tags: tags,
  Wallpapers: wallpapers,
};
