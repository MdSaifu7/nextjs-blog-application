import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { CommentSection } from "@/components/web/CommentsSection";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  User,
} from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import type { Metadata } from "next";
import { PostPresence } from "@/components/web/PostPresence";
import { fetchAuthQuery, getToken } from "@/lib/auth-server";

interface PageProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;

  // 1. Fetch the data using your working Convex query

  const post = await fetchQuery(api.posts.getPostById, {
    postId: resolvedParams.postId as Id<"posts">,
  });
  // const post =
  // const userId=await ;
  if (!post) {
    return {
      title: "Post not found",
    };
  }
  return {
    title: `${post.title}`,
    description: `${post.content}`,
  };
}

export default async function PostIdRoute({ params }: PageProps) {
  const resolvedParams = await params;
  const token = await getToken();

  // 1. Fetch the data using your working Convex query
  // const token = await getConvexToken();
  const [post, userId] = await Promise.all([
    fetchQuery(
      api.posts.getPostById,

      {
        postId: resolvedParams.postId,
      },

      { token }
    ),

    fetchQuery(
      api.presence.getUserId,

      {},
      { token }
    ),
  ]);
  if (!userId) {
    return redirect("/auth/sign-in");
  }
  // 2. Handle 404 cleanly if no post matches the ID
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/blogs"
            className={
              buttonVariants({ variant: "ghost", size: "sm" }) +
              " gap-2 text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-md"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-md"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Article Layout */}
        <article className="space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4 border-b pb-6">
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary tracking-wide uppercase">
                Trending
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight capitalize">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center font-medium text-xs text-primary">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-foreground">
                  Author ({post.authorId.slice(0, 6)})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time>
                  {new Date(post._creationTime).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>2 min read</span>
              </div>
              <div>
                {" "}
                {userId && (
                  <PostPresence
                    roomId={resolvedParams.postId}
                    userId={userId}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Render Convex Image Dynamically */}

          <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-muted border shadow-sm">
            <Image
              src={
                post.imageUrl
                  ? post.imageUrl
                  : " https://images.unsplash.com/photo-1767072528344-3c2716ef7556?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
              }
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-300 hover:scale-[1.01]"
              sizes="(max-w-4xl) 100vw, 896px"
            />
          </div>

          {/* Grid Layout for Content & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
            {/* Main Content Body */}
            <div className="lg:col-span-3 space-y-6 max-w-none">
              <p className="text-xl leading-relaxed text-foreground font-medium first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
                {post.content}
              </p>

              <p className="text-base leading-7 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                elementum sem vel sem dictum, id finibus felis cursus. Class
                aptent taciti sociosqu ad litora torquent per conubia nostra,
                per inceptos himenaeos.
              </p>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-1 space-y-6 border-t lg:border-t-0 lg:border-l lg:pl-6 pt-6 lg:pt-0">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Post Metadata
                </h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">ID:</span>{" "}
                    {post._id}
                  </p>
                </div>
              </div>

              <hr className="border-muted" />

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Share Thoughts
                </h3>
                <p className="text-xs text-muted-foreground">
                  {`Enjoyed this ${post.title} article? Share it across your handles or
                  bookmark it for later.`}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
      {/* comment section */}
      <CommentSection postId={resolvedParams.postId as Id<"posts">} />
    </div>
  );
}
