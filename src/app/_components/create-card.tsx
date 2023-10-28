"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

interface CreateCardProps {
  deckId: number,
}

export default function CreateCard({ deckId }: CreateCardProps) {
  const router = useRouter();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const createCard = api.card.createCard.useMutation({
    onSuccess: () => {
      router.refresh();
      setFront("");
      setBack("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createCard.mutate({ deckId, front, back });
      }}
      className="flex gap-2 mb-4"
    >
      <input
        type="text"
        placeholder="Card Front"
        value={front}
        onChange={(e) => setFront(e.target.value)}
        className="outline rounded-lg px-2 py-1"
      />
      <input
        type="text"
        placeholder="Card Back"
        value={back}
        onChange={(e) => setBack(e.target.value)}
        className="outline rounded-lg px-2 py-1"
      />
      <button
        type="submit"
        disabled={createCard.isLoading}
        className="outline rounded-full px-2 py-1"
      >
        {createCard.isLoading ? "Creating card..." : "Create"}
      </button>
    </form>
  );
}