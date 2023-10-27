import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { decks } from "~/server/db/schema";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "30 s"),
  analytics: true,
});

export const deckRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({
      name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.userId;

      const { success } = await ratelimit.limit(creatorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.db.insert(decks).values({
        name: input.name,
        creatorId
      });
    }),

  getAll: privateProcedure
    .query(({ ctx }) => {
      const userId = ctx.userId;
      return ctx.db.query.decks.findMany({
        where: (decks, { eq }) => eq(decks.creatorId, userId),
      });
    }),
});
