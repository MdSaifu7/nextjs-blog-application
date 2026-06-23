import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Create a new task with the given text

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx); // ✅ add await
    if (!user) {
      throw new Error("User not logged In");
    }

    const blogArticle = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });
    return blogArticle;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch all posts from the database ordered by newest first
    const allPosts = await ctx.db.query("posts").order("desc").collect();

    // 2. Map through each post and resolve its storage ID to a real URL
    return await Promise.all(
      allPosts.map(async (post) => {
        // If the post has a valid storage ID, fetch its public URL
        let imageUrl = null;
        if (post.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(post.imageStorageId);
        }

        // Return the original post data combined with the resolved image URL
        return {
          ...post,
          imageUrl,
        };
      })
    );
  },
});
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    // const user = await authComponent.safeGetAuthUser(ctx);
    // if (!user) {
    //   throw new Error("User not logged In");
    // }
    return await ctx.storage.generateUploadUrl();
  },
});

export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    // If the post has an image ID, convert it into a public URL
    let imageUrl = null;
    if (post.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(
        post.imageStorageId as Id<"_storage">
      );
    }

    return {
      ...post,
      imageUrl, // This will be a standard HTTPS string URL (or null)
    };
  },
});
// export const sendImage = mutation({
//   args: { storageId: v.id("_storage"), author: v.string() },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("posts", {
//       imageStorageId: args.storageId,
//       authorId: args.author,
//       format: "image",
//     });
//   },
// });

interface searchResultTypes {
  _id: string;
  title: string;
  content: string;
}
export const searchPosts = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit;

    const results: Array<searchResultTypes> = [];

    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<"posts">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          content: doc.content,
        });
        if (results.length >= limit) break;
      }
    };

    const titleMatches = await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.term))
      .take(limit);

    await pushDocs(titleMatches);

    if (results.length < limit) {
      const bodyMatches = await ctx.db
        .query("posts")
        .withSearchIndex("search_content", (q) =>
          q.search("content", args.term)
        )
        .take(limit);

      await pushDocs(bodyMatches);
    }

    return results;
  },
});
