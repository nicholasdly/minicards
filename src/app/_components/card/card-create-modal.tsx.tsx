"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

interface CreateCardModalProps {
  deckId: number;
}

export function CreateCardModal({ deckId }: CreateCardModalProps) {
  const utils = api.useUtils();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const createCard = api.card.createCard.useMutation({
    onSuccess: () => {
      setFront("");
      setBack("");
      void utils.deck.get.invalidate({ id: deckId });
      toast.success("Successfully created card!");
      (document.getElementById('create-card-modal-front-input') as HTMLInputElement).focus();
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  });
  
  return (
    <dialog id="create-card-modal" className="modal">
      <div className="modal-box items-center justify-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg mb-3">Create a new card</h3>
        <form
          className="flex flex-col items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            createCard.mutate({ deckId, front, back });
          }}
        >
          <input
            id="create-card-modal-front-input"
            type="text"
            placeholder="Front of card"
            className="input input-bordered w-full"
            value={front}
            onChange={(e) => setFront(e.target.value)}
          />
          <input
            type="text"
            placeholder="Back of card"
            className="input input-bordered w-full"
            value={back}
            onChange={(e) => setBack(e.target.value)}
          />
          <button
            type="submit"
            disabled={createCard.isLoading}
            className="btn normal-case w-full"
          >
            {createCard.isLoading ? <span className="loading loading-dots loading-sm" /> : "Create"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
