"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateDeckButton() {
  return (
    <button
      className="btn normal-case"
      onClick={() => {
        const createDeckModal = document.getElementById('create-deck-modal') as HTMLDialogElement;
        createDeckModal.showModal()
      }}
    >
      <span className="font-medium">Create new deck</span>
    </button>
  );
}

export function CreateDeckModal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createDeck = api.deck.createDeck.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDescription("");
    },
  });
  
  return (
    <dialog id="create-deck-modal" className="modal">
      <div className="modal-box items-center justify-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg mb-3">Create a new deck</h3>
        <form
          className="flex flex-col items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            createDeck.mutate({ name, description });
          }}
        >
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="input input-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            disabled={createDeck.isLoading}
            className="btn normal-case w-full"
          >
            {createDeck.isLoading ? <span className="loading loading-dots loading-sm" /> : "Create"}
          </button>
        </form>
      </div>
    </dialog>
  );
}