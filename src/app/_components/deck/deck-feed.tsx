import { api } from "~/trpc/server";
import { CreateDeckButton } from "./deck-create";
import Link from "next/link";

export default async function DeckFeed() {
  const decks = await api.deck.getUserDecks.query();
  
  return (
    <div className="flex flex-col px-16 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Your Decks</h1>
        <CreateDeckButton />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {decks.map(deck => (
          <Link
            key={deck.id}
            href={`/deck/${deck.id}`}
            className="card bg-base-200 hover:bg-base-300 transition transition-300"
          >
            <div className="card-body">
              <h2 className="card-title line-clamp-2">{deck.title}</h2>
              <p className="line-clamp-2">{deck.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
