import { CreateCardModal } from "~/app/_components/card/card-create";
import CardFeed from "~/app/_components/card/card-feed";

interface PageProps {
  params: { deckId: string }
}

export default function Page({ params }: PageProps) {
  const deckId = Number(params.deckId);

  return (
    <main className="flex justify-center mt-8">
      <CardFeed deckId={deckId} />
      <CreateCardModal deckId={deckId} />
    </main>
  );
}