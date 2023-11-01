import { expect, it } from "vitest";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { type RouterInputs } from "~/trpc/shared";

it("unauthorized user should not be able to create a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["deck"]["create"] = {
    title: "test deck title",
    description: "test deck description",
  };

  await expect(caller.deck.create(input)).rejects.toThrowError();
});

it("unauthorized user should not be able to retrieve decks", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.deck.getAll()).rejects.toThrowError();
});

it("unauthorized user should not be able to retrieve a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.deck.get({ id: 1 })).rejects.toThrowError();
});

it("unauthorized user should not be able to update a deck's title", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["deck"]["updateTitle"] = {
    id: 1,
    title: "test deck updated title"
  }

  await expect(caller.deck.updateTitle(input)).rejects.toThrowError();
});

it("unauthorized user should not be able to update a deck's description", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  const input: RouterInputs["deck"]["updateDescription"] = {
    id: 1,
    description: "test deck updated description"
  }

  await expect(caller.deck.updateDescription(input)).rejects.toThrowError();
});

it("unauthorized user should not be able to delete a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: null });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.deck.delete({ id: 1 })).rejects.toThrowError();
});

it("user must provide a valid deck title to create a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: "test user id" });
  const caller = appRouter.createCaller(ctx);

  let input: RouterInputs["deck"]["create"];
  
  // title must be of length greater than 0
  input = {
    title: "",
    description: "valid description",
  };
  await expect(caller.deck.create(input)).rejects.toThrowError();

  // title must be of length less than 25
  input = {
    title: "qwertyuiopasdfghjklzxcvbn",
    description: "valid description",
  }
  await expect(caller.deck.create(input)).rejects.toThrowError();
});

it("user must provide a valid deck description to create a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: "test user id" });
  const caller = appRouter.createCaller(ctx);

  let input: RouterInputs["deck"]["create"];

  // description must be of length greater than 0
  input = {
    title: "valid title",
    description: "",
  };
  await expect(caller.deck.create(input)).rejects.toThrowError();

  // description must be of length less than 176
  input = {
    title: "valid title",
    description: "kzrtrSYNW2TrAjMyiyYMSJpLCRg0AJiDrxiT90iE4r08haAEhaqGttKk9UFgiDx8rdiyXpmH1htfE2Vyg1kvdLUAEjzbi1J4Ly6UpUpgfQRaxZncEByjafLha6NkMwPHqvawiHRECHmxCAAR45Na05AQC4WUD5R6w4gp6JFfTGWdeGz1",
  };
  await expect(caller.deck.create(input)).rejects.toThrowError();
});

it("user must provide a valid deck ID to retrieve a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: "test user id" });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.deck.get({ id: 3.145 })).rejects.toThrowError(); // must be integer
  await expect(caller.deck.get({ id: 0 })).rejects.toThrowError();  // must be greater than zero
  await expect(caller.deck.get({ id: -5 })).rejects.toThrowError();  // must be positive
  await expect(caller.deck.get({ id: Infinity })).rejects.toThrowError();  // must be finite
});

it("user must provide a valid deck ID when updating a deck's title", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: "test user id" });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.deck.updateTitle({ id: 3.145, title: "valid title" })).rejects.toThrowError(); // must be integer
  await expect(caller.deck.updateTitle({ id: 0, title: "valid title" })).rejects.toThrowError();  // must be greater than zero
  await expect(caller.deck.updateTitle({ id: -5, title: "valid title" })).rejects.toThrowError();  // must be positive
  await expect(caller.deck.updateTitle({ id: Infinity, title: "valid title" })).rejects.toThrowError();  // must be finite
});

it("user must provide a valid deck title when updating a deck's title", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: "test user id" });
  const caller = appRouter.createCaller(ctx);
  
  // title must be of length greater than 0
  await expect(caller.deck.updateTitle({ id: 1, title: "" })).rejects.toThrowError();

  // title must be of length less than 25
  await expect(caller.deck.updateTitle({ id: 1, title: "qwertyuiopasdfghjklzxcvbn" })).rejects.toThrowError();
});

it("user must provide a valid deck ID when updating a deck's description", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: "test user id" });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.deck.updateDescription({ id: 3.145, description: "valid description" })).rejects.toThrowError(); // must be integer
  await expect(caller.deck.updateDescription({ id: 0, description: "valid description" })).rejects.toThrowError();  // must be greater than zero
  await expect(caller.deck.updateDescription({ id: -5, description: "valid description" })).rejects.toThrowError();  // must be positive
  await expect(caller.deck.updateDescription({ id: Infinity, description: "valid description" })).rejects.toThrowError();  // must be finite
});

it("user must provide a valid deck description when updating a deck's description", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: "test user id" });
  const caller = appRouter.createCaller(ctx);

  // description must be of length greater than 0
  await expect(caller.deck.updateDescription({ id: 1, description: "" })).rejects.toThrowError();

  // description must be of length less than 176
  const input: RouterInputs["deck"]["updateDescription"] = {
    id: 1,
    description: "kzrtrSYNW2TrAjMyiyYMSJpLCRg0AJiDrxiT90iE4r08haAEhaqGttKk9UFgiDx8rdiyXpmH1htfE2Vyg1kvdLUAEjzbi1J4Ly6UpUpgfQRaxZncEByjafLha6NkMwPHqvawiHRECHmxCAAR45Na05AQC4WUD5R6w4gp6JFfTGWdeGz1"
  };
  await expect(caller.deck.updateDescription(input)).rejects.toThrowError();
});

it("user must provide a valid deck ID to delete a deck", async () => {
  const ctx = createInnerTRPCContext({ headers: new Headers, userId: "test user id" });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.deck.delete({ id: 3.145 })).rejects.toThrowError(); // must be integer
  await expect(caller.deck.delete({ id: 0 })).rejects.toThrowError();  // must be greater than zero
  await expect(caller.deck.delete({ id: -5 })).rejects.toThrowError();  // must be positive
  await expect(caller.deck.delete({ id: Infinity })).rejects.toThrowError();  // must be finite
});
