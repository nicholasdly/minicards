"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GarbageIcon } from "../shared/icons";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { Dialog } from "@headlessui/react";
import { MIN_DECK_SIZE } from "~/constants";

interface EditDeckFormProps {
  deck: {
    title: string;
    description: string;
    id: number;
    publicId: string;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date | null;
    cards: {
      id: number | undefined;
      front: string;
      back: string;
      deckId: number;
    }[];
  }
}

// TODO: actually delete a card when a user clicks the card trash icon

export default function EditDeckForm({ deck }: EditDeckFormProps) {
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const openDeleteConfirmationModal = () => setDeleteConfirmationOpen(true);
  const closeDeleteConfirmationModal = () => setDeleteConfirmationOpen(false);
  
  const router = useRouter();
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description);
  const [cards, setCards] = useState(deck.cards);
  

  const updateDeck = api.deck.update.useMutation({
    onSuccess: () => {
      router.push(`/deck/${deck.publicId}`);
      router.refresh();
      toast.success("Successfully updated deck!");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  });

  const deleteDeck = api.deck.delete.useMutation({
    onSuccess: () => {
      router.push("/");
      router.refresh();
      toast.success("Successfully deleted deck!");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  })

  return (
    <>
      <div className="form-control flex flex-col">
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="input input-bordered mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex flex-col gap-3">
          {cards.map((card, index) => (
            <div key={index} className="bg-base-200 p-3 rounded-lg">
              <div className="flex px-3 items-center justify-between">
                <div className="text-lg font-medium">{index + 1}</div>
                <button
                  className="hover:text-red-500"
                  onClick={() => {
                    if (cards.length > MIN_DECK_SIZE) {
                      setCards(cards.toSpliced(index, 1))
                    } else {
                      toast.error(`A deck must have atleast ${MIN_DECK_SIZE} cards!`);
                    }
                  }}
                >
                  <GarbageIcon size={20} />
                </button>
              </div>
              <div className="divider mt-1" />
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Front"
                  className="input input-bordered min-w-0"
                  value={card.front}
                  onChange={(e) => {
                    setCards(cards.toSpliced(index, 1, {
                      id: card.id,
                      front: e.target.value,
                      back: card.back,
                      deckId: card.deckId
                    }))
                  }}
                />
                <input
                  type="text"
                  placeholder="Back"
                  className="input input-bordered min-w-0"
                  value={card.back}
                  onChange={(e) => {
                    setCards(cards.toSpliced(index, 1, {
                      id: card.id,
                      front: card.front,
                      back: e.target.value,
                      deckId: card.deckId
                    }))
                  }}
                />
              </div>
            </div>
          ))}
          <button
            className="flex-1 btn normal-case"
            onClick={() => {
              setCards([...cards, {
                id: undefined,
                front: '',
                back: '',
                deckId: deck.id
              }])
            }}
          >
            Add card
          </button>
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="btn btn-wide normal-case text-red-600"
            disabled={deleteDeck.isLoading || updateDeck.isLoading}
            onClick={openDeleteConfirmationModal}
          >
            {deleteDeck.isLoading ? <span className="loading" /> : "Delete deck"}
          </button>
          <button
            className="btn btn-wide normal-case"
            disabled={updateDeck.isLoading || deleteDeck.isLoading}
            onClick={() => updateDeck.mutate({ id: deck.id, title, description, cards })}
          >
            {updateDeck.isLoading ? <span className="loading" /> : "Save changes"}
          </button>
        </div>
      </div>

      <Dialog as="div" className="relative z-10" open={isDeleteConfirmationOpen} onClose={closeDeleteConfirmationModal}>
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-base-100 p-6 align-middle">
              <Dialog.Title as="h3" className="text-lg font-medium">Delete this deck?</Dialog.Title>
              <div className="mt-2">
                <p className="text-sm">
                  Are you sure you want to delete this deck?
                  All deck data will be <span className="text-red-600">permanently</span> removed, including its cards.
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  className="btn normal-case"
                  onClick={closeDeleteConfirmationModal}
                >
                  Close
                </button>
                <button
                  className="btn normal-case text-red-600"
                  onClick={() => {
                    deleteDeck.mutate({ id: deck.id });
                    closeDeleteConfirmationModal();
                  }}
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}