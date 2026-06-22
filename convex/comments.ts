import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
export const getCommentsByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();

    return comments;
  },
});
export const createComment = mutation({
  args: {
    postId: v.id("posts"),

    content: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("User not logged In");
    }
    const comment = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: user._id,
      authorName: user.name,
      content: args.content,
    });
    // do something with `taskId`
  },
});
