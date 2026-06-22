"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";
import { Menu } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchInput } from "./SearchInput";
import { ThemeToggle } from "./theme.toggle";

import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-zinc-100 ${
      pathname === path ? "text-zinc-100" : "text-zinc-400"
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-4 md:px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="border-zinc-800 bg-zinc-950">
                <div className="mt-8 flex flex-col gap-5">
                  <Link
                    href="/"
                    className="text-lg font-medium text-zinc-200 hover:text-white"
                  >
                    Home
                  </Link>

                  <Link
                    href="/blogs"
                    className="text-lg font-medium text-zinc-200 hover:text-white"
                  >
                    Blogs
                  </Link>

                  <Link
                    href="/create"
                    className="text-lg font-medium text-zinc-200 hover:text-white"
                  >
                    Create
                  </Link>

                  <div className="my-2 h-px bg-zinc-800" />

                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      className="justify-start px-0 text-zinc-300 hover:text-white"
                      onClick={async () => {
                        await authClient.signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              toast.success("Logged out successfully.");
                              router.push("/");
                            },
                            onError: (err) => {
                              toast.error(err.error.message);
                            },
                          },
                        });
                      }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link
                        href="/auth/sign-in"
                        className="text-zinc-300 hover:text-white"
                      >
                        Sign In
                      </Link>

                      <Link
                        href="/auth/sign-up"
                        className="text-zinc-300 hover:text-white"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 tracking-tight transition-opacity hover:opacity-90"
          >
            <span className="text-xl font-bold text-white">
              Next<span className="text-blue-500">Pro</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link href="/blogs" className={navLinkClass("/blogs")}>
            Blogs
          </Link>

          <Link href="/create" className={navLinkClass("/create")}>
            Create
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <SearchInput />

          <div className="hidden h-4 w-px bg-zinc-800 sm:block" />

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-zinc-900" />
            ) : isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-zinc-400 hover:text-white"
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        toast.success("Logged out successfully.");
                        router.push("/");
                      },
                      onError: (err) => {
                        toast.error(err.error.message);
                      },
                    },
                  });
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/sign-up"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className:
                      "hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 text-white rounded-full px-4",
                  })}
                >
                  Sign Up
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
