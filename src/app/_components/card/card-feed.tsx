"use client";

import { api } from "~/trpc/react";
import LoadingScreen from "../loading";
import dayjs from "dayjs";
import CreateCardButton from "./card-create-button";
import Flashcards from "./flashcards";
import CardOptionsDropdown from "../deck/deck-options-dropdown";

interface CardFeedProps {
  deckId: number;
}

export default function CardFeed({ deckId }: CardFeedProps) {
  const deck = api.deck.get.useQuery({ id: deckId });

  if (deck.isLoading) return <LoadingScreen />
  if (!deck.data) return <div>A deck of the provided ID does not exist.</div>

  return (
    <div className="flex flex-col w-full max-w-2xl">
      <div className="flex justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">{deck.data.title}</h1>
          <span className="text-sm">Created on {dayjs(deck.data.createdAt).format("MMMM D, YYYY")}</span>
          <div className="badge badge-ghost rounded-full mt-1">{deck.data.cards.length} cards</div>
        </div>
        <div className="flex items-center gap-1">
          <CreateCardButton />
          <CardOptionsDropdown />
        </div>
      </div>
      <p className="mt-4 mb-6">{deck.data.description}</p>
      <Flashcards cards={deck.data.cards} />
      <div className="mt-6 flex flex-col items-center gap-0.5">
        <p>Press <kbd className="kbd kbd-sm">Space</kbd> to flip the flashcard.</p>
        <p>Press <kbd className="kbd kbd-sm">▶︎</kbd> to go to the next flashcard.</p>
        <p>Press <kbd className="kbd kbd-sm">◀︎</kbd> to go to the previous flashcard.</p>
      </div>
    </div>
  );
}