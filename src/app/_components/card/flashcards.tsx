import { useEffect, useState } from "react";

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
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);

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
        <p>This deck is empty!</p>
        <p>Add a card to populate this deck.</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className={`w-full ${flipped ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-base-100 h-96 flex justify-center items-center rounded-3xl p-10 outline">
            <p className="text-2xl line-clamp-[8]">{cards[index]?.front}</p>
          </div>
        </div>
        <div className={`w-full ${flipped ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0`}>
          <div className="bg-base-300 h-96 flex justify-center items-center rounded-3xl p-10 outline">
            <p className="text-2xl line-clamp-[8]">{cards[index]?.back}</p>
          </div>
        </div>
        <div className="absolute top-5 right-5">
          {index + 1}/{cards.length}
        </div>
      </div>
    </>
  );
}
