"use client";

import { Search, Sparkles, ChevronDown, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  className?: string;
}

export function TopHeader({ className }: TopHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between border-b border-light-grey bg-white px-4",
        className
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/sh-logotype-thumb.svg"
            alt="Digitala Företagen"
            width={140}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Search Section */}
      <div className="flex flex-1 items-center justify-center px-4 lg:px-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mischka" />
          <Input
            type="search"
            placeholder="Sök i kunskapsbanken..."
            className="h-10 w-full rounded-lg border-light-grey bg-ghost-white pl-10 pr-12 text-sm placeholder:text-mischka focus-visible:ring-azure"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-light-grey bg-white px-1.5 font-mono text-[10px] font-medium text-mischka">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* User Profile */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-vulcan hover:bg-ghost-white"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-azure text-white">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden lg:inline">Konto</span>
          <ChevronDown className="h-4 w-4 text-mischka" />
        </Button>

        {/* AI Assistant Button */}
        <Button
          variant="default"
          className="flex items-center gap-2 rounded-lg bg-azure px-4 py-2 text-sm font-medium text-white hover:bg-azure/90"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden lg:inline">AI-assistenten</span>
        </Button>
      </div>
    </header>
  );
}

export default TopHeader;
