import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
export default function Hero() {
  return (
    <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 flex flex-col items-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-6 backdrop-blur-sm animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Now Live
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-3xl leading-[1.1]">
          Welcome to my <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Blog Application
          </span>
        </h1>

        {/* Subtitle Description */}
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Discover insightful articles, deep dives into modern technology, and
          stories written by passionate developers. Explore our latest thoughts
          or share your own.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/blogs"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className:
                "bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 gap-2 group shadow-lg shadow-blue-600/20",
            })}
          >
            Read Articles
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/create"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white rounded-full px-8 transition-colors",
            })}
          >
            Start Writing
          </Link>
        </div>
      </div>
    </section>
  );
}
