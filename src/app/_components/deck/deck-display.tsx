interface DeckDisplayProps {
  cards: {
    id: number;
    createdAt: Date;
    deckId: number;
    front: string;
    back: string;
  }[];
}

interface FlashcardProps {
  front: string;
  back: string;
}

export default function DeckDisplay({ cards }: DeckDisplayProps) {
  return (
    <div className="stack">
      {cards.length > 0
        ? cards.map(card => <Flashcard key={card.id} front={card.front} back={card.back} />)
        : <Flashcard front="This deck is empty!" back="Hello world!" />}
    </div>
  );
}

function Flashcard({ front, back }: FlashcardProps) {
  return (
    <div className="bg-base-200 h-96 flex flex-col justify-center items-center rounded-3xl p-10 outline-dotted overflow-hidden">
      <p className="text-2xl line-clamp-[8]">{front}; {back}</p>
    </div>
  );
}