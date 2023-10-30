import { expect, it } from "vitest";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { type RouterInputs } from "~/trpc/shared";

it("unauthorized user should not be able to create a flashcard", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["card"]["createCard"] = {
    deckId: 1,
    front: "test flashcard front",
    back: "test flashcard back",
  };

  await expect(caller.card.createCard(input)).rejects.toThrowError();
});

it("user must provide valid deck ID to create a flashcard", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  let input: RouterInputs["card"]["createCard"] = {
    deckId: 0,
    front: "test flashcard front",
    back: "test flashcard back",
  };
  await expect(caller.card.createCard(input)).rejects.toThrowError();

  input = {
    deckId: -1,
    front: "test flashcard front",
    back: "test flashcard back",
  };
  await expect(caller.card.createCard(input)).rejects.toThrowError();

  input = {
    deckId: Infinity,
    front: "test flashcard front",
    back: "test flashcard back",
  };
  await expect(caller.card.createCard(input)).rejects.toThrowError();
});

it("user must provide valid content for the front of the flashcard during creation", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["card"]["createCard"] = {
    deckId: 1,
    front: "",
    back: "test flashcard back",
  };

  await expect(caller.card.createCard(input)).rejects.toThrowError();
});

it("user must provide valid content for the back of the flashcard during creation", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["card"]["createCard"] = {
    deckId: 1,
    front: "test flashcard front",
    back: "",
  };
  
  await expect(caller.card.createCard(input)).rejects.toThrowError();
});
