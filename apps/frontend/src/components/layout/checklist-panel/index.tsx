"use client";

import { MessageSquare, X, ChevronDown, ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useCommentSafe, type Comment } from "@/components/layout/comment-context";
import { useState } from "react";

interface CommentPanelProps {
  className?: string;
  triggerClassName?: string;
}

// Default demo content when no comment is selected
const defaultContent = {
  title: "Avtalskommentar",
  text: `Välj en kommentar genom att klicka på kommentarikonen bredvid en paragraf i texten.

Röda ikoner indikerar interna kommentarer och orange ikoner indikerar externa kommentarer.`,
};

export function CommentPanel({ className, triggerClassName }: CommentPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const commentContext = useCommentSafe();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border-azure bg-white px-4 py-2 text-azure shadow-lg hover:bg-azure hover:text-white lg:hidden",
            triggerClassName
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Kommentar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={cn("w-full sm:w-80 p-0", className)}
      >
        <CommentContent
          selectedComment={commentContext?.selectedComment ?? null}
          onClose={() => {
            setIsOpen(false);
            commentContext?.setSelectedComment(null);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

// Desktop version that slides out when a comment is selected
export function CommentSidebar({ className }: { className?: string }) {
  const commentContext = useCommentSafe();

  return (
    <aside
      className={cn(
        "flex h-full w-80 min-w-80 flex-col border-l border-light-grey bg-white",
        className
      )}
    >
      <CommentContent
        selectedComment={commentContext?.selectedComment ?? null}
        onClose={() => commentContext?.setSelectedComment(null)}
      />
    </aside>
  );
}

// Shared content component
function CommentContent({
  selectedComment,
  onClose,
}: {
  selectedComment: Comment | null;
  onClose?: () => void;
}) {
  const [aiExpanded, setAiExpanded] = useState(false);

  const isInternal = selectedComment?.type === "internal";
  const isExternal = selectedComment?.type === "external";
  const hasComment = selectedComment?.html || selectedComment?.content;

  const title = hasComment
    ? isInternal
      ? "Intern kommentar"
      : "Extern kommentar"
    : defaultContent.title;

  const iconColor = isInternal ? "text-paleruby" : isExternal ? "text-tangy" : "text-paleruby";

  return (
    <div className="flex h-full flex-col">
      {/* AI Assistant Section */}
      <Collapsible open={aiExpanded} onOpenChange={setAiExpanded}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between border-b border-light-grey px-4 py-3 text-left hover:bg-ghost-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-azure" />
              <span className="text-sm font-medium text-vulcan">AI-assistenten</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-mischka transition-transform",
                aiExpanded && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-b border-light-grey bg-ghost-white p-4">
            <p className="text-sm text-pale-sky">
              Ställ frågor om detta avtal eller be om hjälp med tolkning.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Comment Header */}
      <div className="flex items-center justify-between border-b border-light-grey px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className={cn("h-5 w-5", iconColor)} />
          <span className="text-sm font-medium text-vulcan">{title}</span>
        </div>
        {hasComment && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-pale-sky hover:text-vulcan"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Comment Content - Scrollable */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          {hasComment ? (
            <div
              className="prose prose-sm max-w-none text-vulcan"
              dangerouslySetInnerHTML={{ __html: selectedComment?.html || "" }}
            />
          ) : (
            <div className="prose prose-sm max-w-none">
              {defaultContent.text.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-sm leading-relaxed text-pale-sky">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Template Links - shown when comment is active */}
          {hasComment && (
            <div className="mt-6 space-y-3">
              <a
                href="#"
                className="flex items-center justify-between rounded-lg border border-light-grey bg-white p-4 transition-colors hover:bg-ghost-white"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-mischka uppercase tracking-wide mb-1">
                    Blankett
                  </div>
                  <div className="text-sm text-vulcan truncate">
                    Relaterad mall
                  </div>
                </div>
                <FileText className="h-5 w-5 shrink-0 text-mischka ml-3" />
              </a>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer - Always visible at bottom */}
      <div className="mt-auto border-t border-light-grey p-4">
        <Button
          variant="outline"
          className="w-full border-light-grey text-vulcan hover:bg-ghost-white"
          onClick={onClose}
        >
          Stäng
        </Button>
      </div>
    </div>
  );
}

// Re-export with old names for compatibility
export { CommentPanel as ChecklistPanel, CommentSidebar as ChecklistSidebar };

export default CommentPanel;
