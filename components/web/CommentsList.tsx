"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CommentListProps {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}

export function CommentList({ preloadedComments }: CommentListProps) {
  const comments = usePreloadedQuery(preloadedComments);

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight mb-4">
        Comments{" "}
        <span className="text-muted-foreground">({comments.length})</span>
      </h2>

      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center text-sm text-muted-foreground">
          No comments yet. Be the first to share your thoughts.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <Card key={comment._id} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <span className="text-sm font-medium">
                  {comment.authorName}
                </span>
                <time
                  dateTime={new Date(comment._creationTime).toISOString()}
                  className="text-xs text-muted-foreground"
                >
                  {formatRelativeTime(comment._creationTime)}
                </time>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-foreground/90">
                {comment.content}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}
