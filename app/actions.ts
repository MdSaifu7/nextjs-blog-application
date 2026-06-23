"use server";

import z from "zod";
import { createPostSchema } from "./schema/blog";
import { fetchMutation, fetchQuery } from "convex/nextjs"; // Back to standard fetchMutation
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Id } from "@/convex/_generated/dataModel";
import { revalidatePath } from "next/cache";

export async function createBlogAction(
  values: z.infer<typeof createPostSchema>
) {
  const parsed = createPostSchema.safeParse(values);

  try {
    if (!parsed.success) {
      throw new Error("Invalid form data");
    }

    // 1. Grab cookies/headers from the active Next.js incoming request
    const reqHeaders = await headers();
    const headersObj = Object.fromEntries(reqHeaders.entries());

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const tokenResponse = await fetch(`${baseUrl}/api/auth/convex/token`, {
      headers: headersObj,
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to retrieve auth token from Better Auth");
    }

    const { token } = await tokenResponse.json();

    if (!token) {
      throw new Error("User not logged In on server context");
    }

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        content: parsed.data.content,
        imageStorageId: parsed.data.storageId as Id<"_storage">,
      },
      { token } // <--- This fulfills the JWT verification your backend wants!
    );
  } catch {
    return {
      error: "Failed tp upload post",
    };
  }

  revalidatePath("/blogs");
  return;
}

export async function getUploadUrlAction() {
  try {
    const reqHeaders = await headers();
    const headersObj = Object.fromEntries(reqHeaders.entries());
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const tokenResponse = await fetch(`${baseUrl}/api/auth/convex/token`, {
      headers: headersObj,
    });

    if (!tokenResponse.ok) {
      console.error("Token fetch failed with status:", tokenResponse.status);
      return { error: "Better Auth endpoint returned an error status" };
    }

    const { token } = await tokenResponse.json();
    if (!token) {
      console.error("No token found in response body");
      return { error: "User not logged in on server context" };
    }

    // This is where Convex might be rejecting it or failing to run
    const uploadUrl = await fetchMutation(
      api.posts.generateUploadUrl,
      {},
      { token }
    );
    return { uploadUrl };
  } catch (error) {
    // LOOK AT YOUR TERMINAL LOGS FOR THIS:
    console.error("CRITICAL ERROR IN GET_UPLOAD_URL_ACTION:", error);
    return {
      error: `Failed to authenticate upload: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
export async function getBlogAction() {
  // 1. Grab cookies/headers from the active Next.js incoming request
  const reqHeaders = await headers();

  // 2. Fetch the Convex JWT token from Better Auth's endpoint internally
  // We must pass the headers so Better Auth knows who is asking!
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const tokenResponse = await fetch(`${baseUrl}/api/auth/convex/token`, {
    headers: reqHeaders,
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to retrieve auth token from Better Auth");
  }

  const { token } = await tokenResponse.json();

  if (!token) {
    throw new Error("User not logged In on server context");
  }

  // 3. Send the mutation to Convex using the JWT token
  const res = await fetchQuery(
    api.posts.getPosts,
    {},
    { token } // <--- This fulfills the JWT verification your backend wants!
  );

  return res;
}
