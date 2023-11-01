import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { decks } from "~/server/db/schema";

/**
 * An Upstash rate limiter that allows 10 requests per 30 seconds.
 */
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "30 s"),
  analytics: true,
});

export const deckRouter = createTRPCRouter({

  /**
   * Creates a new deck given a valid name.
   */
  createDeck: privateProcedure
    .input(z.object({
      title: z
        .string()
        .min(1, { message: "A deck must have a title!" })
        .max(24, { message: "Your deck title can't be longer than 24 characters!" }),
      description: z
        .string()
        .min(1, { message: "A deck must have a description!" })
        .max(175, { message: "Your deck description can't be longer than 175 characters!" }),
    }))
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.userId;

      const { success } = await ratelimit.limit(creatorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.db.insert(decks).values({
        title: input.title,
        description: input.description,
        creatorId
      });
    }),

  /**
   * Returns a list of all flashcard decks created by the current user.
   */
  getUserDecks: privateProcedure
    .query(({ ctx }) => {
      const userId = ctx.userId;
      return ctx.db.query.decks.findMany({
        where: (decks, { eq }) => eq(decks.creatorId, userId),
        orderBy: (deck, { desc }) => [desc(deck.createdAt)],
      });
    }),

  /**
   * Returns a specified flashcard deck (including its flashcards).
   */
  getDeck: privateProcedure
    .input(z.object({
      id: z.number().int().positive().finite(),
    }))
    .query(({ ctx, input }) => {
      return ctx.db.query.decks.findFirst({
        where: (deck, { eq }) => eq(deck.id, input.id),
        with: {
          cards: true
        }
      })
    }),

});
