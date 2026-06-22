import z from "zod";
export const postFormSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  image: z.instanceof(File),
});
export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  storageId: z.string(),
});
