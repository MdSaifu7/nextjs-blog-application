// import { Loader2, Search } from "lucide-react";
// import { Input } from "../ui/input";
// import React, { useState } from "react";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import Link from "next/link";

// export function SearchInput() {
//   const [term, setTerm] = useState("");
//   const [open, setOpen] = useState(false);

//   const results = useQuery(
//     api.posts.searchPosts,
//     term.length >= 2 ? { limit: 5, term: term } : "skip"
//   );

//   function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setTerm(e.target.value);
//     setOpen(true);
//   }

//   return (
//     <div className="relative w-full max-w-sm z-10">
//       <div className="relative">
//         <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//         <Input
//           type="search"
//           placeholder="Search Posts..."
//           className="w-full pl-8 bg-background"
//           value={term}
//           onChange={handleInputChange}
//         />
//       </div>

//       {open && term.length >= 2 && (
//         <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
//           {results === undefined ? (
//             <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
//               <Loader2 className="mr-2 size-4 animate-spin" />
//               Searching...
//             </div>
//           ) : results.length === 0 ? (
//             <p className="p-4 text-sm text-muted-foreground text-center">
//               No results found!
//             </p>
//           ) : (
//             <div className="py-1">
//               {results.map((post) => (
//                 <Link
//                   className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
//                   href={`/blogs/${post._id}`}
//                   key={post._id}
//                   onClick={() => {
//                     setOpen(false);
//                     setTerm("");
//                   }}
//                 >
//                   <p className="font-medium truncate">{post.title}</p>
//                   <p className="text-xs text-muted-foreground pt-1">
//                     {post.content.substring(0, 60)}
//                   </p>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { Loader2, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export function SearchInput() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { limit: 5, term: term } : "skip"
  );

  // Close dropdown when clicking outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setOpen(true);
  }

  return (
    <div
      ref={containerRef}
      className="relative z-50 w-full max-w-[240px] sm:max-w-[280px]"
    >
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 transition-colors group-focus-within:text-blue-500" />
        <Input
          type="search"
          placeholder="Search posts..."
          className="w-full h-9 pl-9 pr-8 bg-zinc-800/40 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 rounded-full focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:bg-zinc-800/80 transition-all duration-200"
          value={term}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
        />
        {term && (
          <button
            onClick={() => {
              setTerm("");
              setOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && term.length >= 2 && (
        <div className="absolute right-0 top-full mt-2 w-[320px] max-h-[380px] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-md p-2 text-zinc-100 shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-1">
          {results === undefined ? (
            <div className="flex items-center justify-center py-6 text-sm text-zinc-400">
              <Loader2 className="mr-2 size-4 animate-spin text-blue-500" />
              Searching index...
            </div>
          ) : results.length === 0 ? (
            <p className="py-6 text-sm text-zinc-500 text-center">
              No articles found.
            </p>
          ) : (
            <div className="space-y-0.5">
              <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Matches Found
              </div>
              {results.map((post) => (
                <Link
                  className="flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm hover:bg-zinc-900/80 transition-colors group cursor-pointer"
                  href={`/blogs/${post._id}`}
                  key={post._id}
                  onClick={() => {
                    setOpen(false);
                    setTerm("");
                  }}
                >
                  <p className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-zinc-500 line-clamp-1">
                    {post.content}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
