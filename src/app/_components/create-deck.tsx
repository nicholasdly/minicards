"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

interface CreateDeckProps {
  userId: string,
}

export default function CreateDeck({ userId }: CreateDeckProps) {
  const router = useRouter();
  const [name, setName] = useState("");

  const createDeck = api.deck.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createDeck.mutate({ name, creatorId: userId });
      }}
      className="flex gap-2 mb-4"
    >
      <input
        type="text"
        placeholder="Deck Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="outline rounded-lg px-2 py-1"
      />
      <button
        type="submit"
        disabled={createDeck.isLoading}
        className="outline rounded-full px-2 py-1"
      >
        {createDeck.isLoading ? "Creating deck..." : "Create"}
      </button>
    </form>
  );
}