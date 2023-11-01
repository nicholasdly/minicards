"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

interface RenameDeckModalProps {
  deckId: number;
}

export function RenameDeckModal({ deckId }: RenameDeckModalProps) {
  const utils = api.useUtils();
  const [title, setTitle] = useState("");

  const renameDeck = api.deck.updateTitle.useMutation({
    onSuccess: () => {
      setTitle("");
      void utils.deck.get.invalidate({ id: deckId });
      (document.getElementById('rename-deck-modal') as HTMLDialogElement).close();
      toast.success("Successfully renamed deck!");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  });
  
  return (
    <dialog id="rename-deck-modal" className="modal">
      <div className="modal-box items-center justify-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg mb-3">Rename deck</h3>
        <form
          className="flex flex-col items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            renameDeck.mutate({ id: deckId, title });
          }}
        >
          <input
            id="rename-deck-modal-title-input"
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="submit"
            disabled={renameDeck.isLoading}
            className="btn normal-case w-full"
          >
            {renameDeck.isLoading ? <span className="loading loading-dots loading-sm" /> : "Create"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
