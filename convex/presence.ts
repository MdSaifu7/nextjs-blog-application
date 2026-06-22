import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { Presence } from "@convex-dev/presence";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

export const presence = new Presence(components.presence);

export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },

  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    // TODO: Add your auth checks here.

    return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
  },
});

// convex/presence.ts  ← this file

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    const entries = await presence.list(ctx, roomToken);

    return await Promise.all(
      entries.map(async (entry) => {
        const user = await authComponent.getAnyUserById(ctx, entry.userId);

        if (!user) {
          return entry;
        }

        return {
          ...entry,
          name: user.name,
          image: user.image ?? null, // ← ADD THIS LINE
        };
      })
    );
  },
});
export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    // Can't check auth here because it's called over http from sendBeacon.
    return await presence.disconnect(ctx, sessionToken);
  },
});
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    return user?._id;
  },
});
