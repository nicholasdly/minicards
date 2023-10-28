import { api } from "~/trpc/server";

export default async function DeckList() {
  const userDecks = await api.deck.getUserDecks.query();

  if (userDecks.length === 0) {
    return <div>You have no decks yet.</div>
  }

  return (
    <div className="flex flex-col items-center">
      {userDecks.map(deck => (
        <a
          key={deck.id}
          href={`./deck/${deck.id}`}
          className="underline"
        >
          {deck.name}
        </a>
      ))}
    </div>
  )
}