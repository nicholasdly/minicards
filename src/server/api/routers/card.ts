import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { cards } from "~/server/db/schema";

export const cardRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      deckId: z.number().int().positive().finite(),
      front: z.string().min(1),
      back: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(cards).values({
        deckId: input.deckId,
        front: input.front,
        back: input.back,
      });
    }),

  get: publicProcedure
    .input(z.object({
      id: z.number().int().positive().finite()
    }))
    .query(({ ctx, input }) => {
      return ctx.db.query.cards.findMany({
        where: (cards, { eq }) => eq(cards.id, input.id),
      });
    }),

  getDeck: publicProcedure
    .input(z.object({
      deckId: z.number().int().positive().finite()
    }))
    .query(({ ctx, input }) => {
      return ctx.db.query.cards.findMany({
        where: (cards, { eq }) => eq(cards.deckId, input.deckId),
      });
    }),
});
