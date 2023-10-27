import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { cards } from "~/server/db/schema";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "20 s"),
  analytics: true,
});

export const cardRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({
      deckId: z.number().int().positive().finite(),
      front: z.string().min(1),
      back: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.userId;

      const { success } = await ratelimit.limit(creatorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.db.insert(cards).values({
        deckId: input.deckId,
        front: input.front,
        back: input.back,
      });
    }),

  getAll: privateProcedure
    .input(z.object({
      deckId: z.number().int().positive().finite()
    }))
    .query(({ ctx, input }) => {
      return ctx.db.query.cards.findMany({
        where: (cards, { eq }) => eq(cards.deckId, input.deckId),
      });
    }),
});
