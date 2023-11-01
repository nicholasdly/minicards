"use client";


import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

interface DeleteDeckConfirmationModalProps {
  deckId: number;
}

export function DeleteDeckConfirmationModal({ deckId }: DeleteDeckConfirmationModalProps) {
  const router = useRouter();
  
  const deleteDeck = api.deck.delete.useMutation({
    onSuccess: () => {
      router.push('/');
      router.refresh();
      toast.success("Successfully deleted deck!");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  });
  
  return (
    <dialog id="delete-deck-confirmation-modal" className="modal">
      <div className="modal-box items-center justify-center">
        <h3 className="font-bold text-lg mb-3">Are you sure?</h3>
        <p>
          Deleting a deck is an <span className="font-bold">irreversible</span> action.
          All data for this deck will be lost.
        </p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button id="delete-deck-confirmation-modal-close-button" className="btn normal-case">Close</button>
            <button
              className="btn normal-case bg-red-400 hover:bg-red-500"
              onClick={(e) => {
                e.preventDefault();
                deleteDeck.mutate({ id: deckId });
              }}>
              Delete deck
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
