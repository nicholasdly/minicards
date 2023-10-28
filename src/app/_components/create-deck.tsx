"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function CreateDeck() {
export default function CreateDeck() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createDeck = api.deck.createDeck.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createDeck.mutate({ name });
        createDeck.mutate({ name });
      }}
      className="flex gap-2 mb-4"
      className="flex gap-2 mb-4"
    >
      <input
        type="text"
        placeholder="Deck Name"
        placeholder="Deck Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="outline rounded-lg px-2 py-1"
        className="outline rounded-lg px-2 py-1"
      />
      <button
        type="submit"
        disabled={createDeck.isLoading}
        className="outline rounded-full px-2 py-1"
        disabled={createDeck.isLoading}
        className="outline rounded-full px-2 py-1"
      >
        {createDeck.isLoading ? "Creating deck..." : "Create"}
      </button>
    </form>
  );
}