import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  MAX_CARD_BACK_LENGTH,
  MAX_CARD_FRONT_LENGTH,
  MIN_CARD_BACK_LENGTH,
  MIN_CARD_FRONT_LENGTH
} from "~/constants";

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

  update: privateProcedure
    .input(z.object({
      id: z.number().int().positive().finite(),
      front: z
        .string()
        .min(MIN_CARD_FRONT_LENGTH, { message: "A flashcard must have content for the front!" })
        .max(MAX_CARD_FRONT_LENGTH, { message: `The front of a flashcard can't exceed ${MAX_CARD_FRONT_LENGTH} characters!` }),
      back: z
        .string()
        .min(MIN_CARD_BACK_LENGTH, { message: "A flashcard must have content for the back!" })
        .max(MAX_CARD_BACK_LENGTH, { message: `The back of a flashcard can't exceed ${MAX_CARD_BACK_LENGTH} characters!` }),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.userId;

      const { success } = await ratelimit.limit(user);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.db.update(cards).set({ front: input.front, back: input.back }).where(eq(cards.id, input.id));
    }),

});
