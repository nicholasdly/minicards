import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { eq, notInArray } from "drizzle-orm";
import { z } from "zod";
import {
  MAX_CARD_BACK_LENGTH,
  MAX_CARD_FRONT_LENGTH,
  MAX_DECK_DESCRIPTION_LENGTH,
  MAX_DECK_TITLE_LENGTH,
  MIN_CARD_BACK_LENGTH,
  MIN_CARD_FRONT_LENGTH,
  MIN_DECK_DESCRIPTION_LENGTH,
  MIN_DECK_SIZE,
  MIN_DECK_TITLE_LENGTH,
} from "~/constants";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { cards, decks, generateNanoId } from "~/server/db/schema";

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
   * Creates a new flashcard deck give a title, description, and an initial set of cards.
   */
  create: privateProcedure
    .input(z.object({
      title: z
        .string()
        .trim()
        .min(MIN_DECK_TITLE_LENGTH, { message: `The title of a deck must exceed ${MIN_DECK_TITLE_LENGTH} characters!` })
        .max(MAX_DECK_TITLE_LENGTH, { message: `The title of a deck can't exceed ${MAX_DECK_TITLE_LENGTH} characters!` }),
      description: z
        .string()
        .trim()
        .min(MIN_DECK_DESCRIPTION_LENGTH, { message: `The description of a deck must exceed ${MIN_DECK_DESCRIPTION_LENGTH} characters!` })
        .max(MAX_DECK_DESCRIPTION_LENGTH, { message: `The description of a deck can't exceed ${MAX_DECK_DESCRIPTION_LENGTH} characters!` }),
      cards: z.object({
        front: z
          .string()
          .trim()
          .min(MIN_CARD_FRONT_LENGTH, { message: `The front of a flashcard must exceed ${MIN_CARD_FRONT_LENGTH} characters!` })
          .max(MAX_CARD_FRONT_LENGTH, { message: `The front of a flashcard can't exceed ${MAX_CARD_FRONT_LENGTH} characters!` }),
        back: z
          .string()
          .trim()
          .min(MIN_CARD_BACK_LENGTH, { message: `The back of a flashcard must exceed ${MIN_CARD_BACK_LENGTH} characters!` })
          .max(MAX_CARD_BACK_LENGTH, { message: `The back of a flashcard can't exceed ${MAX_CARD_BACK_LENGTH} characters!` }),
      }).array().min(MIN_DECK_SIZE, { message: `A deck must have at least ${MIN_DECK_SIZE} cards!` }),
    }))
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.userId;

      const { success } = await ratelimit.limit(creatorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.db.transaction(async (tx) => {
        const publicId = generateNanoId();
        const deck = await tx.insert(decks).values({
          title: input.title,
          description: input.description,
          publicId,
          creatorId
        });
        await tx.insert(cards).values(input.cards.map(card => ({ ...card, deckId: Number(deck.insertId) })));
      });
    }),

  /**
   * Returns all flashcard decks created by the current user, sorted by most recently created.
   */
  getAllUser: privateProcedure
    .query(({ ctx }) => {
      const userId = ctx.userId;
      return ctx.db.query.decks.findMany({
        where: (decks, { eq }) => eq(decks.creatorId, userId),
        orderBy: (deck, { desc }) => [desc(deck.createdAt)],
      });
    }),

  /**
   * Retrieves a flashcard deck, including its cards.
   */
  get: privateProcedure
    .input(z.object({
      publicId: z.string().trim().min(1),
    }))
    .query(async ({ ctx, input }) => {
      const deck = await ctx.db.query.decks.findFirst({
        where: (deck, { eq }) => eq(deck.publicId, input.publicId),
        with: { cards: true }
      });

      if (!deck) return { deck, creator: undefined };

      try {
        // getUser() throws error if user is not found with that creatorId
        const creator = await clerkClient.users.getUser(deck.creatorId);
        return {
          deck,
          creator: {
            id: creator.id,
            firstName: creator.firstName,
            lastName: creator.lastName,
            imageUrl: creator.imageUrl,
          }
        }
      } catch (error) {
        return { deck, creator: undefined };
      }
    }),

  /**
   * Updates a flashcard deck give a new title, description, and set of cards.
   */
  update: privateProcedure
    .input(z.object({
      id: z.number().int().positive().finite(),
      title: z
        .string()
        .trim()
        .min(MIN_DECK_TITLE_LENGTH, { message: `The title of a deck must exceed ${MIN_DECK_TITLE_LENGTH} characters!` })
        .max(MAX_DECK_TITLE_LENGTH, { message: `The title of a deck can't exceed ${MAX_DECK_TITLE_LENGTH} characters!` }),
      description: z
        .string()
        .trim()
        .min(MIN_DECK_DESCRIPTION_LENGTH, { message: `The description of a deck must exceed ${MIN_DECK_DESCRIPTION_LENGTH} characters!` })
        .max(MAX_DECK_DESCRIPTION_LENGTH, { message: `The description of a deck can't exceed ${MAX_DECK_DESCRIPTION_LENGTH} characters!` }),
      cards: z.object({
        id: z.number().int().positive().finite().optional(),
        front: z
          .string()
          .trim()
          .min(MIN_CARD_FRONT_LENGTH, { message: `The front of a flashcard must exceed ${MIN_CARD_FRONT_LENGTH} characters!` })
          .max(MAX_CARD_FRONT_LENGTH, { message: `The front of a flashcard can't exceed ${MAX_CARD_FRONT_LENGTH} characters!` }),
        back: z
          .string()
          .trim()
          .min(MIN_CARD_BACK_LENGTH, { message: `The back of a flashcard must exceed ${MIN_CARD_BACK_LENGTH} characters!` })
          .max(MAX_CARD_BACK_LENGTH, { message: `The back of a flashcard can't exceed ${MAX_CARD_BACK_LENGTH} characters!` }),
      }).array().min(MIN_DECK_SIZE, { message: `A deck must have at least ${MIN_DECK_SIZE} cards!` }),
    }))
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.userId;

      const { success } = await ratelimit.limit(creatorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.db.transaction(async (tx) => {
        // update deck title and description
        await tx.update(decks)
          .set({ title: input.title, description: input.description })
          .where(eq(decks.id, input.id));

        // delete removed cards (note: empty maintainedIds array causes error, so that is avoided)
        const maintainedIds = input.cards.filter(card => card.id !== undefined).map(card => card.id!);
        await tx.delete(cards).where(notInArray(cards.id, maintainedIds.length > 0 ? maintainedIds : [-1]));

        // update maintained cards and/or insert new cards
        for (const card of input.cards) {
          if (card.id !== undefined) {
            await tx.update(cards).set({ front: card.front, back: card.back }).where(eq(cards.id, card.id));
          } else {
            await tx.insert(cards).values({ front: card.front, back: card.back, deckId: input.id });
          }
        }
      });
    }),

  /**
   * Delete a flashcard deck.
   */
  delete: privateProcedure
    .input(z.object({
      id: z.number().int().positive().finite(),
    }))
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.userId;

      const { success } = await ratelimit.limit(creatorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.db.transaction(async (tx) => {
        await tx.delete(decks).where(eq(decks.id, input.id));
        await tx.delete(cards).where(eq(cards.deckId, input.id));
      });
    }),

});
