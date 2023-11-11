import { describe, expect, test } from "vitest";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type RouterInputs } from "~/trpc/shared";
import {
  MAX_CARD_BACK_LENGTH,
  MAX_CARD_FRONT_LENGTH,
  MAX_DECK_DESCRIPTION_LENGTH,
  MAX_DECK_TITLE_LENGTH,
  MIN_CARD_BACK_LENGTH,
  MIN_CARD_FRONT_LENGTH,
  MIN_DECK_DESCRIPTION_LENGTH,
  MIN_DECK_SIZE,
  MIN_DECK_TITLE_LENGTH
} from "~/constants";
import { ZodError } from "zod";

describe("create deck", () => {

  test("unauthorized user should not be able to create a deck", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "valid deck title",
      description: "valid deck description",
      cards: new Array<{ front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new TRPCError({ code: "UNAUTHORIZED" });
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });

  test(`deck title must exceed ${MIN_DECK_TITLE_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "x".repeat(MIN_DECK_TITLE_LENGTH - 1),
      description: "valid deck description",
      cards: new Array<{ front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_DECK_TITLE_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The title of a deck must exceed ${MIN_DECK_TITLE_LENGTH} characters!`,
        path: ["title"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });

  test(`deck title can't exceed ${MAX_DECK_TITLE_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "x".repeat(MAX_DECK_TITLE_LENGTH + 1),
      description: "valid deck description",
      cards: new Array<{ front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_DECK_TITLE_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The title of a deck can't exceed ${MAX_DECK_TITLE_LENGTH} characters!`,
        path: ["title"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });

  test(`deck description must exceed ${MIN_DECK_DESCRIPTION_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "valid deck title",
      description: "x".repeat(MIN_DECK_DESCRIPTION_LENGTH - 1),
      cards: new Array<{ front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_DECK_DESCRIPTION_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The description of a deck must exceed ${MIN_DECK_DESCRIPTION_LENGTH} characters!`,
        path: ["description"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });

  test(`deck description can't exceed ${MAX_DECK_DESCRIPTION_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "valid deck title",
      description: "x".repeat(MAX_DECK_DESCRIPTION_LENGTH + 1),
      cards: new Array<{ front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_DECK_DESCRIPTION_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The description of a deck can't exceed ${MAX_DECK_DESCRIPTION_LENGTH} characters!`,
        path: ["description"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });

  test(`deck must have at least ${MIN_DECK_SIZE} cards`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "valid deck title",
      description: "valid deck description",
      cards: new Array<{ front: string, back: string }>(MIN_DECK_SIZE - 1).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_DECK_SIZE,
        type: "array",
        inclusive: true,
        exact: false,
        message: `A deck must have at least ${MIN_DECK_SIZE} cards!`,
        path: ["cards"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });

  test(`card front string must exceed ${MIN_CARD_FRONT_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { front: "x".repeat(MIN_CARD_FRONT_LENGTH - 1), back: "valid card back" },
        { front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_CARD_FRONT_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The front of a flashcard must exceed ${MIN_CARD_FRONT_LENGTH} characters!`,
        path: ["cards", 1, "front"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });
  
  test(`card front string can't exceed ${MAX_CARD_FRONT_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { front: "x".repeat(MAX_CARD_FRONT_LENGTH + 1), back: "valid card back" },
        { front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_CARD_FRONT_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The front of a flashcard can't exceed ${MAX_CARD_FRONT_LENGTH} characters!`,
        path: ["cards", 1, "front"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });
  
  test(`card back string must exceed ${MIN_CARD_BACK_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { front: "valid card front", back: "x".repeat(MIN_CARD_BACK_LENGTH - 1) },
        { front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_CARD_BACK_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The back of a flashcard must exceed ${MIN_CARD_BACK_LENGTH} characters!`,
        path: ["cards", 1, "back"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });
  
  test(`card back string can't exceed ${MAX_CARD_BACK_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["create"] = {
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { front: "valid card front", back: "x".repeat(MAX_CARD_BACK_LENGTH + 1) },
        { front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_CARD_BACK_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The back of a flashcard can't exceed ${MAX_CARD_BACK_LENGTH} characters!`,
        path: ["cards", 1, "back"],
      }
    ]);
  
    await expect(caller.deck.create(input)).rejects.toThrow(error);
  });

});

describe("get all user decks", () => {

  test("unauthorized user should not be able to retrieve current user decks", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
    const caller = appRouter.createCaller(ctx);

    const error = new TRPCError({ code: "UNAUTHORIZED" });
  
    await expect(caller.deck.getAllUser()).rejects.toThrow(error);
  });

});

describe("get deck", () => {

  test("unauthorized user should not be able to retrieve a specific deck", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
    const caller = appRouter.createCaller(ctx);

    const input: RouterInputs["deck"]["get"] = {
      publicId: "abcdef123456",
    };

    const error = new TRPCError({ code: "UNAUTHORIZED" });
  
    await expect(caller.deck.get(input)).rejects.toThrow(error);
  });

  test("public deck id must be nonempty string", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);

    const input: RouterInputs["deck"]["get"] = {
      publicId: "",
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: 1,
        type: "string",
        inclusive: true,
        exact: false,
        message: "String must contain at least 1 character(s)",
        path: ["publicId"],
      }
    ]);
  
    await expect(caller.deck.get(input)).rejects.toThrow(error);
  });

  test("public deck id must not be only whitespace", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);

    const input: RouterInputs["deck"]["get"] = {
      publicId: "   ",
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: 1,
        type: "string",
        inclusive: true,
        exact: false,
        message: "String must contain at least 1 character(s)",
        path: ["publicId"],
      }
    ]);
  
    await expect(caller.deck.get(input)).rejects.toThrow(error);
  });

});

describe("update deck", () => {

  test("unauthorized user should not be able to update a deck", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new TRPCError({ code: "UNAUTHORIZED" });
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

  test("deck id must be an integer", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);

    const input: RouterInputs["deck"]["update"] = {
      id: 3.14159,
      title: "valid deck title",
      description: "valid deck description",
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
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
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });
  
  test("deck id must be a positive nonzero number", async () => {
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

    const zeroInput: RouterInputs["deck"]["update"] = {
      id: 0,
      title: "valid deck title",
      description: "valid deck description",
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const negativeInput: RouterInputs["deck"]["update"] = {
      id: -1,
      title: "valid deck title",
      description: "valid deck description",
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };
  
    await expect(caller.deck.update(zeroInput)).rejects.toThrow(error);
    await expect(caller.deck.update(negativeInput)).rejects.toThrow(error);
  });

  test("deck id must be a finite number", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);

    const input: RouterInputs["deck"]["update"] = {
      id: Infinity,
      title: "valid deck title",
      description: "valid deck description",
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
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
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

  test(`deck title must exceed ${MIN_DECK_TITLE_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "x".repeat(MIN_DECK_TITLE_LENGTH - 1),
      description: "valid deck description",
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_DECK_TITLE_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The title of a deck must exceed ${MIN_DECK_TITLE_LENGTH} characters!`,
        path: ["title"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

  test(`deck title can't exceed ${MAX_DECK_TITLE_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "x".repeat(MAX_DECK_TITLE_LENGTH + 1),
      description: "valid deck description",
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_DECK_TITLE_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The title of a deck can't exceed ${MAX_DECK_TITLE_LENGTH} characters!`,
        path: ["title"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

  test(`deck description must exceed ${MIN_DECK_DESCRIPTION_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "x".repeat(MIN_DECK_DESCRIPTION_LENGTH - 1),
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_DECK_DESCRIPTION_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The description of a deck must exceed ${MIN_DECK_DESCRIPTION_LENGTH} characters!`,
        path: ["description"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

  test(`deck description can't exceed ${MAX_DECK_DESCRIPTION_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "x".repeat(MAX_DECK_DESCRIPTION_LENGTH + 1),
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_DECK_DESCRIPTION_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The description of a deck can't exceed ${MAX_DECK_DESCRIPTION_LENGTH} characters!`,
        path: ["description"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

  test(`deck must have at least ${MIN_DECK_SIZE} cards`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: new Array<{ id?: number, front: string, back: string }>(MIN_DECK_SIZE - 1).fill({
        front: "valid card front",
        back: "valid card back"
      }),
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_DECK_SIZE,
        type: "array",
        inclusive: true,
        exact: false,
        message: `A deck must have at least ${MIN_DECK_SIZE} cards!`,
        path: ["cards"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

  test("card id must be an integer", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);

    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { id: 3.14159, front: "valid card front", back: "valid card back" },
        { id: undefined, front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "invalid_type",
        expected: "integer",
        received: "float",
        message: "Expected integer, received float",
        path: ["cards", 1, "id"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
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
        path: ["cards", 1, "id"],
      }
    ]);

    const zeroInput: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { id: 0, front: "valid card front", back: "valid card back" },
        { id: undefined, front: "valid card front", back: "valid card back" },
      ],
    };

    const negativeInput: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { id: -1, front: "valid card front", back: "valid card back" },
        { id: undefined, front: "valid card front", back: "valid card back" },
      ],
    };
  
    await expect(caller.deck.update(zeroInput)).rejects.toThrow(error);
    await expect(caller.deck.update(negativeInput)).rejects.toThrow(error);
  });

  test("card id must be a finite number", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);

    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { id: Infinity, front: "valid card front", back: "valid card back" },
        { id: undefined, front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "invalid_type",
        expected: "integer",
        received: "float",
        message: "Expected integer, received float",
        path: ["cards", 1, "id"],
      },
      {
        code: "not_finite",
        message: "Number must be finite",
        path: ["cards", 1, "id"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

  test(`card front string must exceed ${MIN_CARD_FRONT_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { front: "x".repeat(MIN_CARD_FRONT_LENGTH - 1), back: "valid card back" },
        { front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_CARD_FRONT_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The front of a flashcard must exceed ${MIN_CARD_FRONT_LENGTH} characters!`,
        path: ["cards", 1, "front"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });
  
  test(`card front string can't exceed ${MAX_CARD_FRONT_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { front: "x".repeat(MAX_CARD_FRONT_LENGTH + 1), back: "valid card back" },
        { front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_CARD_FRONT_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The front of a flashcard can't exceed ${MAX_CARD_FRONT_LENGTH} characters!`,
        path: ["cards", 1, "front"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });
  
  test(`card back string must exceed ${MIN_CARD_BACK_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { front: "valid card front", back: "x".repeat(MIN_CARD_BACK_LENGTH - 1) },
        { front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "too_small",
        minimum: MIN_CARD_BACK_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The back of a flashcard must exceed ${MIN_CARD_BACK_LENGTH} characters!`,
        path: ["cards", 1, "back"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });
  
  test(`card back string can't exceed ${MAX_CARD_BACK_LENGTH} characters`, async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: "valid user id" });
    const caller = appRouter.createCaller(ctx);
  
    const input: RouterInputs["deck"]["update"] = {
      id: 1,
      title: "valid deck title",
      description: "valid deck description",
      cards: [
        { front: "valid card front", back: "valid card back" },
        { front: "valid card front", back: "x".repeat(MAX_CARD_BACK_LENGTH + 1) },
        { front: "valid card front", back: "valid card back" },
      ],
    };

    const error = new ZodError([
      {
        code: "too_big",
        maximum: MAX_CARD_BACK_LENGTH,
        type: "string",
        inclusive: true,
        exact: false,
        message: `The back of a flashcard can't exceed ${MAX_CARD_BACK_LENGTH} characters!`,
        path: ["cards", 1, "back"],
      }
    ]);
  
    await expect(caller.deck.update(input)).rejects.toThrow(error);
  });

});

describe("delete deck", () => {

  test("unauthorized user should not be able to delete a deck", async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
    const caller = appRouter.createCaller(ctx);

    const error = new TRPCError({ code: "UNAUTHORIZED" });
  
    await expect(caller.deck.delete({ id: 1 })).rejects.toThrow(error);
  });

  test("deck id must be an integer", async () => {
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
  
    await expect(caller.deck.delete({ id: 3.14159 })).rejects.toThrow(error);
  });
  
  test("deck id must be a positive nonzero number", async () => {
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
  
    await expect(caller.deck.delete({ id: 0 })).rejects.toThrow(error);
    await expect(caller.deck.delete({ id: -1 })).rejects.toThrow(error);
  });

  test("deck id must be a finite number", async () => {
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
  
    await expect(caller.deck.delete({ id: Infinity })).rejects.toThrow(error);
  });

});
