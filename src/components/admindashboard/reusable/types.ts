import type { ReactNode } from "react";

/**
 * Config contract for the reusable admin list system.
 * Every admin list page (Ads, Categories, Resolutions, Tags, Wallpapers, …) is
 * described by a `ListPageConfig` and rendered by <AdminListPage/>. Columns,
 * stat cards, filters, sort options and row actions are all data — so the same
 * components render any page with different column names, some cells showing
 * images and others plain text.
 */

export type Align = "left" | "center" | "right";

export interface ColumnDef<T = Row> {
  /** Row field this column reads (also used for default text rendering + sort). */
  key: string;
  header: string;
  align?: Align;
  /** Optional fixed width, e.g. "80px" or "1fr". */
  width?: string;
  /** Custom cell renderer — return an <img>, badge, stacked text, etc. */
  cell?: (row: T) => ReactNode;
}

export interface StatCardDef {
  label: string;
  value: string;
  icon: ReactNode;
  /** e.g. "+5 this month" (green) — or use `trend` for up/down colouring. */
  sub?: string;
  trend?: { text: string; dir?: "up" | "down" };
  /** Icon accent colour (hex). Defaults to the brand green. */
  accent?: string;
}

export interface FilterDef {
  /** Row field this dropdown filters on. */
  key: string;
  /** Placeholder / "all" label, e.g. "All Status". */
  placeholder: string;
  options: { label: string; value: string }[];
}

export type ActionType =
  | "view"
  | "edit"
  | "approve"
  | "reject"
  | "toggle"
  | "delete"
  | "more";

export interface ActionDef<T = Row> {
  type: ActionType;
  title?: string;
  onClick?: (row: T) => void;
  /** For `toggle`: decides play (paused→resume) vs pause (active). */
  isActive?: (row: T) => boolean;
  /** Show this action only for rows where this returns true (e.g. approve on pending). */
  visible?: (row: T) => boolean;
}

export interface SortOption {
  label: string;
  value: string;
}

// Rows are arbitrary records — the config's column keys map into them.
export type Row = Record<string, unknown>;

/** Query the server-side fetcher receives (search/filter/sort/paginate). */
export interface FetchParams {
  search: string;
  filters: Record<string, string>;
  sort: string;
  page: number;
  /** Page size, or `"all"` for admin “See all” (scrollable full list). */
  pageSize: number | "all";
}
export interface FetchResult<T = Row> {
  rows: T[];
  total: number;
}

export interface ListPageConfig<T extends Row = Row> {
  title: string;
  breadcrumb: string[];
  primaryAction?: { label: string; onClick?: () => void };
  /** Optional secondary header button (e.g. "Export" on Wallpapers). */
  secondaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
  /** Show a leading "#" row-number column (Ads/Categories/Resolutions/Tags). */
  showIndex?: boolean;
  /** Static cards (client-side pages). Server pages use `statsFetcher` instead. */
  stats?: StatCardDef[];
  columns: ColumnDef<T>[];
  filters?: FilterDef[];
  sortOptions?: SortOption[];
  actions?: ActionDef<T>[];
  /** Static rows (client-side pages). Provide `fetcher` for server-side data. */
  data?: T[];
  /** Server-side data source — when set, search/filter/sort/paginate hit the API. */
  fetcher?: (params: FetchParams) => Promise<FetchResult<T>>;
  /** Server-side stat cards (fetched once). Falls back to `stats` when absent. */
  statsFetcher?: () => Promise<StatCardDef[]>;
  /** Loading placeholder text for the table body while fetching. */
  loadingText?: string;
  /** Grid view (list/grid toggle): full-width card cover image URL for a row. */
  gridImage?: (row: T) => string;
  /** Grid view: which column key is the card's heading (defaults to first column). */
  gridTitleKey?: string;
  /** Fields the reusable search box matches against. */
  searchKeys?: string[];
  searchPlaceholder?: string;
  /** Stable id per row (for React keys). */
  rowId: (row: T) => string;
}
