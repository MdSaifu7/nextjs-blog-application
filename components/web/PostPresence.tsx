"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import usePresence from "@convex-dev/presence/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface iAppProps {
  roomId: Id<"posts">;
  userId: string;
}

export function PostPresence({ roomId, userId }: iAppProps) {
  const presenceState = usePresence(api.presence, roomId, userId);

  return (
    <div className="flex items-center">
      {presenceState?.slice(0, 5).map((user, index) => (
        <Avatar
          key={user.userId}
          className={`h-8 w-8 border-2 border-background ${
            index > 0 ? "-ml-2" : ""
          }`}
        >
          <AvatarImage
            src={
              user.image ??
              `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
            }
            alt={user.name}
          />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}

      {presenceState && presenceState.length > 5 && (
        <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
          +{presenceState.length - 5}
        </div>
      )}
    </div>
  );
}
