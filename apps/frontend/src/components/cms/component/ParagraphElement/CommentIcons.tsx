"use client";

import { MessageSquare } from "lucide-react";
import { useCommentSafe, type Comment } from "@/components/layout/comment-context";
import { cn } from "@/lib/utils";

interface CommentIconsProps {
  internalComment?: { json?: unknown; html?: string | null } | null;
  externalComment?: { json?: unknown; html?: string | null } | null;
}

export function CommentIcons({ internalComment, externalComment }: CommentIconsProps) {
  const commentContext = useCommentSafe();

  const hasInternal = !!(internalComment?.html || internalComment?.json);
  const hasExternal = !!(externalComment?.html || externalComment?.json);

  if (!hasInternal && !hasExternal) {
    return null;
  }

  const handleClick = (type: "internal" | "external", comment: { json?: unknown; html?: string | null } | null | undefined) => {
    if (!commentContext || !comment) return;

    const content = comment.json ? JSON.stringify(comment.json) : null;
    const html = comment.html || null;

    commentContext.setSelectedComment({
      type,
      content,
      html,
    });
  };

  return (
    <div className="absolute -right-2 top-0 flex flex-col gap-1 translate-x-full pl-2">
      {hasExternal && (
        <button
          onClick={() => handleClick("external", externalComment)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
            "bg-tangy/20 text-tangy hover:bg-tangy/30"
          )}
          title="Extern kommentar"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      )}
      {hasInternal && (
        <button
          onClick={() => handleClick("internal", internalComment)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
            "bg-paleruby/20 text-paleruby hover:bg-paleruby/30"
          )}
          title="Intern kommentar"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
