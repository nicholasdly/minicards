import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { eq } from "drizzle-orm";
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
      front: z
        .string()
        .min(1, { message: "A flashcard must have content for the front!" })
        .max(600, { message: "The front of your flashcard can't exceed 600 characters!" }),
      back: z
        .string()
        .min(1, { message: "A flashcard must have content for the back!" })
        .max(600, { message: "The back of your flashcard can't exceed 600 characters!" }),
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
     * Delete a specified flashcard.
     */
    delete: privateProcedure
      .input(z.object({
        id: z.number().int().positive().finite(),
      }))
      .mutation(async ({ ctx, input }) => {
        const creatorId = ctx.userId;

        const { success } = await ratelimit.limit(creatorId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

        await ctx.db.delete(cards).where(eq(cards.id, input.id));
      }),

});
