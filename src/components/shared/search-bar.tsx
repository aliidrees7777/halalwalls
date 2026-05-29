"use client";

import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  size?: "default" | "large";
}

export function SearchBar({ className, size = "default" }: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/80 p-2 shadow-xl shadow-black/5 backdrop-blur-xl sm:flex-row sm:items-center",
        size === "large" && "p-2.5",
        className
      )}
    >
      <div className="relative flex flex-1 items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search restaurants, cuisines, dishes..."
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          aria-label="Search restaurants"
        />
      </div>
      <div className="hidden h-8 w-px bg-border sm:block" />
      <div className="relative flex flex-1 items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 sm:max-w-[200px]">
        <MapPin className="size-4 shrink-0 text-emerald-500" />
        <Input
          type="text"
          placeholder="City or ZIP"
          defaultValue="Chicago, IL"
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          aria-label="Location"
        />
      </div>
      <Button
        size={size === "large" ? "lg" : "default"}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 sm:w-auto sm:px-8"
      >
        Search
      </Button>
    </div>
  );
}
