"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export function CreateDeckButton() {
  return (
    <button
      className="btn normal-case"
      onClick={() => {
        (document.getElementById('create-deck-modal') as HTMLDialogElement).showModal();
      }}
    >
      <span className="font-medium">Create new deck</span>
    </button>
  );
}

export function CreateDeckModal() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createDeck = api.deck.createDeck.useMutation({
    onSuccess: () => {
      router.refresh();
      setTitle("");
      setDescription("");
      (document.getElementById('create-deck-modal') as HTMLDialogElement).close();
      toast.success("Successfully created deck!");
    },
    onError: (error) => {
      const message = error.data?.zodError?.fieldErrors.content;
      toast.error(message?.[0] ? message[0] : "Something went wrong!");
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
            createDeck.mutate({ title, description });
          }}
        >
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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