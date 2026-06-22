import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getBlogAction } from "@/app/actions";
import { Suspense } from "react";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { cacheLife, cacheTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Blog | My Awesome Website",
  description:
    "Explore our latest articles, tutorials, and insights on web development and technology.",
  openGraph: {
    title: "Blog | My Awesome Website",
    description: "Explore our latest articles, tutorials, and insights.",
    type: "website",
    url: "https://mywebsite.com/blog",
  },
};

const BlogPage = async () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b">
        <div className="container mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-5xl font-bold tracking-tight">My Blog</h1>

          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Dive into the minds of iconic characters—from fearless leaders and
            ruthless villains to legendary warriors—and discover what makes them
            unforgettable.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <Suspense fallback={blogSkeleton()}>{getBlogList()}</Suspense>
    </main>
  );
};

export default BlogPage;

async function getBlogList() {
  // const posts = await getBlogAction();
  // "use cache";
  // cacheLife("hours");
  // cacheTag("blogs");
  await connection();
  const posts = await fetchQuery(api.posts.getPosts);
  return (
    <section className="container mx-auto max-w-7xl px-6 py-12">
      {posts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold">No Posts Found</h2>

            <p className="mt-2 text-muted-foreground">
              Create your first blog post to see it here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <div className="relative w-full aspect-video bg-muted border-b">
                  <Image
                    src={
                      post.imageUrl ??
                      "https://plus.unsplash.com/premium_photo-1710800032613-6e528143e119?q=80&w=2822&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                    priority={false}
                  />
                </div>
                <CardTitle className="line-clamp-2 text-center transition-colors group-hover:text-primary">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="line-clamp-4 text-muted-foreground text-center">
                  {post.content}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/blogs/${post._id}`}> Read More →</Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
async function blogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-items-center">
      {[...Array(6)].map((_, i) => (
        <Card
          key={i}
          className="w-full max-w-xs border border-gray-200 dark:border-zinc-800 shadow-sm animate-pulse"
        >
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-700" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-full bg-gray-200 dark:bg-zinc-700" />
            <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-700" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
