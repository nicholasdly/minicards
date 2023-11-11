import { TRPCError } from "@trpc/server";
import { describe, expect, test } from "vitest";
import { ZodError } from "zod";
import { MAX_CARD_BACK_LENGTH, MAX_CARD_FRONT_LENGTH, MIN_CARD_BACK_LENGTH, MIN_CARD_FRONT_LENGTH } from "~/constants";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { type RouterInputs } from "~/trpc/shared";

describe("update card", () => {

  test("unauthorized user should not be able to update a card", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["card"]["update"] = {
      id: 1,
      front: "valid card front",
      back: "valid card back",
    };
  
    const error = new TRPCError({ code: "UNAUTHORIZED" });

    await expect(caller.card.update(input)).rejects.toThrow(error);
  });

  test("card id must be an integer", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["card"]["update"] = {
      id: 3.14159,
      front: "valid card front",
      back: "valid card back",
    };
  
    const error = new ZodError([
      {
        code: "invalid_type",
        expected: "integer",
        received: "float",
        message: "Expected integer, received float",
        path: ["id"],
      }
    ]);

    await expect(caller.card.update(input)).rejects.toThrow(error);
  });

  test("card id must be a positive nonzero number", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const error = new ZodError([
      {
        code: "too_small",
        minimum: 0,
        type: "number",
        inclusive: false,
        exact: false,
        message: "Number must be greater than 0",
        path: ["id"],
      }
    ]);

    await expect(caller.card.update({
      id: 0,
      front: "valid card front",
      back: "valid card back"
    })).rejects.toThrow(error);

    await expect(caller.card.update({
      id: -1,
      front: "valid card front",
      back: "valid card back"
    })).rejects.toThrow(error);
  });
  
  test("card id must be a finite number", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["card"]["update"] = {
      id: Infinity,
      front: "valid card front",
      back: "valid card back",
    };

    const error = new ZodError([
      {
        code: "invalid_type",
        expected: "integer",
        received: "float",
        message: "Expected integer, received float",
        path: ["id"],
      },
      {
        code: "not_finite",
        message: "Number must be finite",
        path: ["id"],
      }
    ]);
  
    await expect(caller.card.update(input)).rejects.toThrow(error);
  });
  
  test(`card front string must exceed ${MIN_CARD_FRONT_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["card"]["update"] = {
      id: 1,
      front: "x".repeat(MIN_CARD_FRONT_LENGTH - 1),
      back: "valid card back",
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_CARD_FRONT_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The front of a flashcard must exceed ${MIN_CARD_FRONT_LENGTH} characters!`,
        path: ["front"],
      }
    ]);
  
    await expect(caller.card.update(input)).rejects.toThrow(error);
  });
  
  test(`card front string can't exceed ${MAX_CARD_FRONT_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["card"]["update"] = {
      id: 1,
      front: "x".repeat(MAX_CARD_FRONT_LENGTH + 1),
      back: "valid card back",
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_CARD_FRONT_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The front of a flashcard can't exceed ${MAX_CARD_FRONT_LENGTH} characters!`,
        path: ["front"],
      }
    ]);
  
    await expect(caller.card.update(input)).rejects.toThrow(error);
  });
  
  test(`card back string must exceed ${MIN_CARD_BACK_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["card"]["update"] = {
      id: 1,
      front: "valid card front",
      back: "x".repeat(MIN_CARD_BACK_LENGTH - 1),
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_CARD_BACK_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The back of a flashcard must exceed ${MIN_CARD_BACK_LENGTH} characters!`,
        path: ["back"],
      }
    ]);
  
    await expect(caller.card.update(input)).rejects.toThrow(error);
  });
  
  test(`card back string can't exceed ${MAX_CARD_BACK_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["card"]["update"] = {
      id: 1,
      front: "valid card front",
      back: "x".repeat(MAX_CARD_BACK_LENGTH + 1),
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_CARD_BACK_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The back of a flashcard can't exceed ${MAX_CARD_BACK_LENGTH} characters!`,
        path: ["back"],
      }
    ]);
  
    await expect(caller.card.update(input)).rejects.toThrow(error);
  });

});

describe("delete card", () => {

  test("unauthorized user should not be able to delete a card", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
    const caller = appRouter.createCaller(ctx);
  
    const error = new TRPCError({ code: "UNAUTHORIZED" });

    await expect(caller.card.delete({ id: 1 })).rejects.toThrow(error);
  });

  test("card id must be an integer", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);

    const error = new ZodError([
      {
        code: "invalid_type",
        expected: "integer",
        received: "float",
        message: "Expected integer, received float",
        path: ["id"],
      }
    ]);
  
    await expect(caller.card.delete({ id: 3.14159 })).rejects.toThrow(error);
  });
  
  test("card id must be a positive nonzero number", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
    
    const error = new ZodError([
      {
        code: "too_small",
        minimum: 0,
        type: "number",
        inclusive: false,
        exact: false,
        message: "Number must be greater than 0",
        path: ["id"],
      }
    ]);
  
    await expect(caller.card.delete({ id: 0 })).rejects.toThrow(error);
    await expect(caller.card.delete({ id: -1 })).rejects.toThrow(error);
  });

  test("card id must be a finite number", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);

    const error = new ZodError([
      {
        code: "invalid_type",
        expected: "integer",
        received: "float",
        message: "Expected integer, received float",
        path: ["id"],
      },
      {
        code: "not_finite",
        message: "Number must be finite",
        path: ["id"],
      }
    ]);
  
    await expect(caller.card.delete({ id: Infinity })).rejects.toThrow(error);
  });

});
