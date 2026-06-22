import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const commentSchema = z.object({
  postId: z.custom<Id<"posts">>(),
  content: z.string(),
});
