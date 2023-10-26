import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { decks } from "~/server/db/schema";

export const deckRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      creatorId: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(decks).values({
        name: input.name,
        creatorId: input.creatorId
      });
    }),

  get: publicProcedure
    .input(z.object({
      id: z.number().int().positive().finite()
    }))
    .query(({ ctx, input }) => {
      return ctx.db.query.decks.findMany({
        where: (decks, { eq }) => eq(decks.id, input.id),
      });
    }),

  getUserDecks: publicProcedure
    .input(z.object({
      userId: z.string().min(1)
    }))
    .query(({ ctx, input }) => {
      return ctx.db.query.decks.findMany({
        where: (decks, { eq }) => eq(decks.creatorId, input.userId),
      });
    }),
});
