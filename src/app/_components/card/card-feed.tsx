"use client";

import { api } from "~/trpc/react";
import LoadingScreen from "../loading";
import dayjs from "dayjs";
import { CreateCardButton } from "./card-create";
import DeckDisplay from "../deck/deck-display";

interface CardFeedProps {
  deckId: number;
}

export default function CardFeed({ deckId }: CardFeedProps) {
  const deck = api.deck.getDeck.useQuery({ id: deckId });

  if (deck.isLoading) return <LoadingScreen />
  if (!deck) return <div>A deck of the provided ID does not exist.</div>;
  if (!deck.data) return <div>This deck is empty!</div>

  return (
    <div className="flex flex-col w-full max-w-2xl">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">{deck.data.title}</h1>
          <span className="text-sm">Created on {dayjs(deck.data.createdAt).format("MMMM D, YYYY")}</span>
          <div className="badge badge-ghost rounded-full mt-1">
            {deck.data.cards.length} cards
          </div>
        </div>
        <CreateCardButton />
      </div>
      <p className="mt-4 mb-6">{deck.data.description}</p>
      <DeckDisplay cards={deck.data.cards} />
    </div>
  );
}