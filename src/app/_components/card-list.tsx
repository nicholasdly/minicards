import { api } from "~/trpc/server";

interface CardListProps {
  id: number,
}

export default async function CardList({ id }: CardListProps) {
  const deck = await api.deck.getDeck.query({ id });

  if (!deck) {
    return <div>There does not exist a deck with this ID.</div>
  }

  const cards = deck.cards;
  if (!cards ||  cards.length === 0) {
    return <div>There are no cards in this deck.</div>
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl font-bold">{deck.name}</p>
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