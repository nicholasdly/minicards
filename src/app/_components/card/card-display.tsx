interface DeckDisplayProps {
  cards: {
    id: number;
    createdAt: Date;
    deckId: number;
    front: string;
    back: string;
  }[];
}

interface CardProps {
  front: string;
  back: string;
}

export default function CardDisplay({ cards }: DeckDisplayProps) {
  return (
    <div className="stack">
      {cards.length > 0
        ? cards.map(card => <Card key={card.id} front={card.front} back={card.back} />)
        : (
          <div className="bg-base-200 h-96 flex flex-col justify-center items-center rounded-3xl p-10">
            <p>This deck is empty!</p>
            <p>Add a card to populate this deck.</p>
          </div>
        )}
    </div>
  );
}

function Card({ front, back }: CardProps) {
  return (
    <div className="bg-base-200 h-96 flex flex-col justify-center items-center rounded-3xl p-10 outline-dotted overflow-hidden">
      <p className="text-2xl line-clamp-[8]">{front}; {back}</p>
    </div>
  );
}
