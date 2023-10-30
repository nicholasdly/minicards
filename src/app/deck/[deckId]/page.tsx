import dayjs from "dayjs";
import { CreateCardButton, CreateCardModal } from "~/app/_components/card/card-create";
import DeckDisplay from "~/app/_components/deck/deck-display";
import { api } from "~/trpc/server";

interface PageProps {
  params: { deckId: string }
}

export default async function Page({ params }: PageProps) {
  const deckId = Number(params.deckId);
  const deck = await api.deck.getDeck.query({ id: deckId });

  if (!deck) return <div>A deck of the provided ID does not exist.</div>;

  return (
    <main className="flex justify-center mt-8">
      <div className="flex flex-col w-full max-w-2xl">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">{deck.title}</h1>
            <span className="text-sm">Created on {dayjs(deck.createdAt).format("MMMM D, YYYY")}</span>
            <div className="badge badge-ghost rounded-full mt-1">
              {deck.cards.length} cards
            </div>
          </div>
          <CreateCardButton />
        </div>
        <p className="mt-4 mb-6">{deck.description}</p>
        <DeckDisplay cards={deck.cards} />
      </div>
      <CreateCardModal deckId={deckId} />
    </main>
  );
}