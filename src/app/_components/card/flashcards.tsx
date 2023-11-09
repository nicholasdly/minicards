"use client";

import { useEffect, useState } from "react";
import { EditIcon } from "../shared/icons";
import { Dialog } from "@headlessui/react";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

interface FlashcardsProps {
  cards: {
    id: number;
    deckId: number;
    front: string;
    back: string;
  }[];
}

// Used to check if the current active element is of an input type, so that the flashcard flipping event listener
// doesn't interfere with the user attempting to type, trigger a button, etc.
const inputTags = ["INPUT", "SELECT", "BUTTON", "TEXTAREA"];

export default function Flashcards({ cards }: FlashcardsProps) {
  const utils = api.useUtils();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const updateCard = api.card.update.useMutation({
    onSuccess: () => {
      void utils.deck.get.invalidate();
      toast.success("Successfully updated deck!");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Makes sure that the user isn't attempting to do anything other than flip the flashcard.
      if (!document.activeElement || inputTags.includes(document.activeElement.tagName)) return;
      
      if (e.key === " ") {
        e.preventDefault();
        setFlipped(!flipped);
      } else if (e.key === "ArrowLeft") {
        setFlipped(false);
        setIndex(index <= 0 ? cards.length - 1 : index - 1);
      } else if (e.key === "ArrowRight") {
        setFlipped(false);
        setIndex(index >= cards.length - 1 ? 0 : index + 1);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cards.length, flipped, index]);

  if (cards.length === 0) {
    return (
      <div className="h-96 flex flex-col justify-center items-center rounded-3xl p-10 outline-dashed">
        <p className="font-bold">This deck is empty!</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className={`w-full ${flipped ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-base-100 h-96 flex justify-center items-center rounded-3xl p-10 outline">
            <p className="text-sm sm:text-base lg:text-xl">{cards[index]?.front}</p>
          </div>
        </div>
        <div className={`w-full ${flipped ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0`}>
          <div className="bg-base-300 h-96 flex justify-center items-center rounded-3xl outline p-10">
            <p className="text-sm sm:text-base lg:text-xl">{cards[index]?.back}</p>
          </div>
        </div>
        <div className="absolute top-5 left-5">
          {index + 1}/{cards.length}
        </div>
        <button
          className="absolute top-5 right-5 hover:text-neutral-400 tooltip"
          data-tip="Edit Card"
          onClick={() => {
            setFront(cards[index]!.front);
            setBack(cards[index]!.back);
            openEditModal();
          }}
        >
          <EditIcon />
        </button>
      </div>

      <Dialog as="div" className="relative z-10" open={isEditModalOpen} onClose={closeEditModal}>
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-base-100 p-6 align-middle">
              <Dialog.Title as="h3" className="text-lg font-medium">Edit flashcard</Dialog.Title>
              <div className="flex flex-col gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Front"
                  className="input input-bordered w-full"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Back"
                  className="input input-bordered w-full"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  className="btn normal-case"
                  onClick={closeEditModal}
                >
                  Close
                </button>
                <button
                  className="btn normal-case"
                  onClick={() => {
                    updateCard.mutate({ id: cards[index]!.id, front, back });
                    closeEditModal();
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
