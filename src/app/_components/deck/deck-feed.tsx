import { api } from "~/trpc/server";
import { CreateDeckButton } from "./deck-create-button";
import Link from "next/link";

export default async function DeckFeed() {
  const decks = await api.deck.getAll.query();
  
  return (
    <div className="flex flex-col px-16 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          {decks.length > 0 ? "Your Decks" : "You have no flashcard decks!"}
        </h1>
        <CreateDeckButton />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {decks.map(deck => (
          <Link
            key={deck.id}
            href={`/deck/${deck.id}`}
            className="card bg-base-200 hover:bg-base-300 transition transition-300 h-64"
          >
            <div className="card-body">
              <h2 className="card-title line-clamp-1">{deck.title}</h2>
              <div>
                {/*
                  Having a line clamped element inside of an element of fixed height causes the line clamping to not
                  work as expected. Placing the below element inside of a div fixes this.
                */}
                <p className="line-clamp-4">{deck.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
