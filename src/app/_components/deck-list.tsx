import { api } from "~/trpc/server";

interface DeckListProps {
  userId: string,
}

export default async function DeckList({ userId }: DeckListProps) {
  const userDecks = await api.deck.getUserDecks.query({ userId });

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