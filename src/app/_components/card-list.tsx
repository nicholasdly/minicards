import { api } from "~/trpc/server";

interface CardListProps {
  deckId: number,
}

export default async function CardList({ deckId }: CardListProps) {
  const cards = await api.card.getDeck.query({ deckId });

  if (cards.length === 0) {
    return <div>There are no cards in this deck.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {cards.map(card => (
        <div key={card.id} className="flex flex-col items-center">
          <p className="font-bold">#{card.id}</p>
          <p><span className="font-semibold">Front:</span> {card.front}</p>
          <p><span className="font-semibold">Back:</span> {card.back}</p>
        </div>
      ))}
    </div>
  )
}