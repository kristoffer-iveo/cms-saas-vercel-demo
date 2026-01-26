"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  BookOpen,
  FileText,
  Newspaper,
  Files,
  ListChecks,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Hem", icon: Home, href: "/" },
  { id: "knowledge", label: "Kunskap", icon: BookOpen, href: "/kunskap" },
  { id: "agreements", label: "Kollektivavtal", icon: FileText, href: "/kollektivavtal" },
  { id: "news", label: "Nyheter", icon: Newspaper, href: "/nyheter" },
  { id: "templates", label: "Mallar", icon: Files, href: "/mallar" },
  { id: "guides", label: "Steg-för-steg", icon: ListChecks, href: "/guider" },
  { id: "courses", label: "Kurser", icon: GraduationCap, href: "/kurser" },
];

interface IconSidebarProps {
  className?: string;
}

export function IconSidebar({ className }: IconSidebarProps) {
  const pathname = usePathname();

  // Determine active item based on current path
  const getActiveItem = () => {
    if (pathname === "/") return "home";

    // Check which nav item's href the current path starts with
    for (const item of navItems) {
      if (item.href !== "/" && pathname.startsWith(item.href)) {
        return item.id;
      }
    }

    return "home";
  };

  const activeItem = getActiveItem();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full w-16 flex-col border-r border-light-grey bg-white",
          className
        )}
      >
        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-azure/10 text-azure"
                        : "text-pale-sky hover:bg-ghost-white hover:text-vulcan"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-azure" />
                    )}
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Support Section */}
        <div className="border-t border-light-grey pb-4 pt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/support"
                className="flex h-12 w-full items-center justify-center text-pale-sky transition-colors hover:bg-ghost-white hover:text-vulcan"
              >
                <HelpCircle className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Support
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export default IconSidebar;
