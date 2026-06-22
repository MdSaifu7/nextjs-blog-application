import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { CreateCommentForm } from "./CreateCommentSection";
import { CommentList } from "./CommentsList";

interface CommentSectionProps {
  postId: Id<"posts">;
}

export async function CommentSection({ postId }: CommentSectionProps) {
  const preloadedComments = await preloadQuery(
    api.comments.getCommentsByPostId,
    { postId }
  );

  return (
    <div className="space-y-6 mt-6">
      <div>
        <CreateCommentForm postId={postId} />
      </div>

      <CommentList preloadedComments={preloadedComments} />
    </div>
  );
}
