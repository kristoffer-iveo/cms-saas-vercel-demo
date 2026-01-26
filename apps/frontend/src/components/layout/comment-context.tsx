"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Comment {
  type: "internal" | "external";
  content: string | null;
  html: string | null;
}

interface CommentContextValue {
  selectedComment: Comment | null;
  setSelectedComment: (comment: Comment | null) => void;
}

const CommentContext = createContext<CommentContextValue | null>(null);

export function CommentProvider({ children }: { children: ReactNode }) {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  return (
    <CommentContext.Provider value={{ selectedComment, setSelectedComment }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComment() {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComment must be used within a CommentProvider");
  }
  return context;
}

export function useCommentSafe() {
  return useContext(CommentContext);
}
