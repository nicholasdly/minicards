import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { cards } from "~/server/db/schema";

/**
 * An Upstash rate limiter that allows 20 requests per 20 seconds.
 */
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "20 s"),
  analytics: true,
});

export const cardRouter = createTRPCRouter({

  /**
   * Creates a new flashcard given a deck ID and content for the front and back of the flashcard.
   */
  createCard: privateProcedure
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

  /**
   * Returns a list of all flashcards belonging to a specified deck.
   */
  getDeckCards: privateProcedure
    .input(z.object({
      deckId: z.number().int().positive().finite()
    }))
    .query(({ ctx, input }) => {
      return ctx.db.query.cards.findMany({
        where: (cards, { eq }) => eq(cards.deckId, input.deckId),
      });
    }),

});
