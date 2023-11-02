"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { GarbageIcon } from "../icons";

interface FlashcardsProps {
  cards: {
    id: number;
    createdAt: Date;
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
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);

  const deleteCard = api.card.delete.useMutation({
    onSuccess: () => {
      void utils.deck.get.invalidate();
      setFlipped(!flipped);
      setIndex(index <= 0 ? 0 : index - 1);
      toast.success("Successfully deleted front of card!");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Makes sure that the user isn't attempting to do anything other than flip the flashcard.
      if (!document.activeElement || inputTags.includes(document.activeElement.tagName)) return;

      if (e.key === " ") {
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
            <p className="text-xl">{cards[index]?.front}</p>
          </div>
        </div>
        <div className={`w-full ${flipped ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0`}>
          <div className="bg-base-300 h-96 flex justify-center items-center rounded-3xl p-10 outline">
            <p className="text-xl">{cards[index]?.back}</p>
          </div>
        </div>
        <div className="absolute top-5 right-5">
          {index + 1}/{cards.length}
        </div>
        <div
          className="absolute bottom-5 right-5 hover:text-neutral-400 hover:cursor-pointer rounded-full"
          onClick={() => {
            const card = cards[index];
            if (card?.id) deleteCard.mutate({ id: card.id });
          }}
        >
          <GarbageIcon />
        </div>
      </div>
    </>
  );
}
