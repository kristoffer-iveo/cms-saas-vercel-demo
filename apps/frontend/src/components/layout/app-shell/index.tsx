"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopHeader } from "@/components/layout/top-header";
import { IconSidebar } from "@/components/layout/icon-sidebar";
import { SecondarySidebar } from "@/components/layout/secondary-sidebar";
import { CommentSidebar } from "@/components/layout/checklist-panel";
import { CommentProvider, useCommentSafe } from "@/components/layout/comment-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Volume2, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
  showSecondarySidebar?: boolean;
  showChecklist?: boolean;
}

export function AppShell({
  children,
  className,
  showSecondarySidebar = true,
  showChecklist = true,
}: AppShellProps) {
  return (
    <CommentProvider>
      <AppShellInner
        className={className}
        showSecondarySidebar={showSecondarySidebar}
        showChecklist={showChecklist}
      >
        {children}
      </AppShellInner>
    </CommentProvider>
  );
}

function AppShellInner({
  children,
  className,
  showSecondarySidebar = true,
  showChecklist = true,
}: AppShellProps) {
  const pathname = usePathname();
  const commentContext = useCommentSafe();
  const hasSelectedComment = !!commentContext?.selectedComment;

  // Build breadcrumbs from current path
  const pathParts = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
    href: "/" + pathParts.slice(0, index + 1).join("/"),
  }));
  return (
    <div className="flex h-screen flex-col bg-ghost-white">
      {/* Top Header */}
      <TopHeader />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Icon Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <IconSidebar />
        </div>

        {/* Secondary Sidebar - hidden on mobile and tablet */}
        {showSecondarySidebar && (
          <div className="hidden lg:block">
            <SecondarySidebar />
          </div>
        )}

        {/* Main Content */}
        <main className={cn("flex flex-1 flex-col overflow-hidden", className)}>
          {/* Content Header with Breadcrumbs and Actions */}
          <div className="flex items-center justify-between border-b border-light-grey bg-white px-6 py-3">
            {/* Breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-pale-sky hover:text-vulcan">
                    Hem
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.label} className="contents">
                    <BreadcrumbSeparator className="text-mischka" />
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="text-vulcan">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="text-pale-sky hover:text-vulcan"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm text-pale-sky hover:text-vulcan"
              >
                <Volume2 className="h-4 w-4" />
                <span className="hidden sm:inline">Lyssna</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm text-pale-sky hover:text-vulcan"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Skriv ut</span>
              </Button>
            </div>
          </div>

          {/* Scrollable Content Area - using native scroll for SSR compatibility */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </div>
        </main>

        {/* Comment Sidebar - slides out when a comment is selected */}
        {showChecklist && (
          <div
            className={cn(
              "hidden lg:flex h-full transition-all duration-300 ease-in-out overflow-hidden",
              hasSelectedComment ? "w-80" : "w-0"
            )}
          >
            <CommentSidebar />
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

// Mobile bottom navigation bar
function MobileBottomNav() {
  return (
    <nav className="flex h-16 items-center justify-around border-t border-light-grey bg-white md:hidden">
      <a
        href="/"
        className="flex flex-col items-center gap-1 text-xs text-pale-sky"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Hem</span>
      </a>
      <a
        href="/kunskap"
        className="flex flex-col items-center gap-1 text-xs text-azure"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span>Kunskap</span>
      </a>
      <a
        href="/nyheter"
        className="flex flex-col items-center gap-1 text-xs text-pale-sky"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <span>Nyheter</span>
      </a>
      <a
        href="/kurser"
        className="flex flex-col items-center gap-1 text-xs text-pale-sky"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
        <span>Kurser</span>
      </a>
    </nav>
  );
}

export default AppShell;
