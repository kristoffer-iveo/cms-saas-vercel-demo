"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronDown, Search, PanelLeftClose, PanelLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getSiblingPages } from "./actions/getSiblingPages";

export interface NavItem {
  key: string;
  label: string;
  href: string;
}

interface SecondarySidebarProps {
  className?: string;
  defaultCollapsed?: boolean;
}

export function SecondarySidebar({
  className,
  defaultCollapsed = false,
}: SecondarySidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [searchQuery, setSearchQuery] = useState("");
  const [pages, setPages] = useState<NavItem[]>([]);
  const [title, setTitle] = useState("Innehåll");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sibling pages when pathname changes
  useEffect(() => {
    let cancelled = false;

    const fetchPages = async () => {
      setIsLoading(true);
      try {
        const result = await getSiblingPages({
          currentPath: pathname,
          locale: "en",
          depth: 1,
        });

        if (cancelled) return;

        // Map to NavItem format and deduplicate by href
        const seen = new Set<string>();
        const navItems: NavItem[] = result.pages
          .map((page) => ({
            key: page.key,
            label: page.displayName,
            href: page.url,
          }))
          .filter((item) => {
            if (seen.has(item.href)) return false;
            seen.add(item.href);
            return true;
          });

        setPages(navItems);

        // Extract title from parent path
        if (result.parentPath) {
          const parentName = result.parentPath.split("/").filter(Boolean).pop();
          if (parentName) {
            const formattedTitle = parentName
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            setTitle(formattedTitle);
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching sibling pages:", error);
          setPages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPages();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    const query = searchQuery.toLowerCase();
    return pages.filter((page) =>
      page.label.toLowerCase().includes(query)
    );
  }, [pages, searchQuery]);

  if (isCollapsed) {
    return (
      <aside
        className={cn(
          "flex h-full w-12 flex-col border-r border-light-grey bg-white",
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="m-2 h-8 w-8 text-pale-sky hover:text-vulcan"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-light-grey bg-white",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-light-grey px-4 py-3">
        <h2 className="text-base font-semibold text-vulcan">Kollektivavtal</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="h-8 w-8 text-pale-sky hover:text-vulcan"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Agreement Selector - Hardcoded for demo */}
      <div className="border-b border-light-grey p-4">
        <button className="flex w-full items-center gap-3 rounded-lg border border-light-grey bg-white p-3 text-left hover:bg-ghost-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ghost-white text-sm font-semibold text-vulcan">
            TA
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-vulcan truncate">Apoteksavtalet</div>
            <div className="text-xs text-pale-sky">1 april 2025 – 31 mars 2027</div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-mischka" />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-light-grey p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mischka" />
          <Input
            type="search"
            placeholder="Sök i Apoteksavtalet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border-light-grey bg-ghost-white pl-9 text-sm placeholder:text-mischka"
          />
        </div>
      </div>

      {/* Sub-header */}
      <div className="px-4 py-3">
        <span className="text-sm font-medium text-vulcan">Apoteksavtalet</span>
      </div>

      {/* Navigation List */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-mischka" />
            </div>
          ) : (
            <>
              {filteredPages.length === 0 && pages.length === 0 && (
                <div className="px-2 py-4 text-center text-sm text-mischka">
                  Inga sidor hittades
                </div>
              )}

              {filteredPages.length === 0 && pages.length > 0 && searchQuery && (
                <div className="px-2 py-4 text-center text-sm text-mischka">
                  Inga resultat för &quot;{searchQuery}&quot;
                </div>
              )}

              {filteredPages.map((page) => {
                const isActive = pathname === page.href;

                return (
                  <Link
                    key={page.key}
                    href={page.href}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-azure/10 font-medium text-azure"
                        : "text-pale-sky hover:bg-ghost-white hover:text-vulcan"
                    )}
                  >
                    <span className="truncate">{page.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

export default SecondarySidebar;
