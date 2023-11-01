"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

interface EditDeckDescriptionModalProps {
  deckId: number;
}

export function EditDeckDescriptionModal({ deckId }: EditDeckDescriptionModalProps) {
  const utils = api.useUtils();
  const [description, setDescription] = useState("");

  const editDeckDescription = api.deck.updateDescription.useMutation({
    onSuccess: () => {
      setDescription("");
      void utils.deck.get.invalidate({ id: deckId });
      (document.getElementById('edit-deck-description-modal') as HTMLDialogElement).close();
      toast.success("Successfully updated deck description!");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  });
  
  return (
    <dialog id="edit-deck-description-modal" className="modal">
      <div className="modal-box items-center justify-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg mb-3">Edit deck description</h3>
        <form
          className="flex flex-col items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            editDeckDescription.mutate({ id: deckId, description });
          }}
        >
          <input
            id="edit-deck-description-modal-description-input"
            type="text"
            placeholder="Description"
            className="input input-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            disabled={editDeckDescription.isLoading}
            className="btn normal-case w-full"
          >
            {editDeckDescription.isLoading ? <span className="loading loading-dots loading-sm" /> : "Create"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
