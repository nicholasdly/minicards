import { expect, it } from "vitest";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { type RouterInputs } from "~/trpc/shared";

it("unauthorized user should not be able to create a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["deck"]["createDeck"] = {
    title: "test deck title",
    description: "test deck description",
  };

  await expect(caller.deck.createDeck(input)).rejects.toThrowError();
});

it("unauthorized user should not be able to fetch a user's deck collection", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.deck.getUserDecks()).rejects.toThrowError();
});

it("user must provide a valid deck name to create a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["deck"]["createDeck"] = {
    title: "",
    description: "test deck description",
  };

  await expect(caller.deck.createDeck(input)).rejects.toThrowError();
});

it("user must provide a valid deck description to create a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["deck"]["createDeck"] = {
    title: "test deck title",
    description: "",
  };
  
  await expect(caller.deck.createDeck(input)).rejects.toThrowError();
});
