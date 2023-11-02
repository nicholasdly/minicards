import { CreateCardModal } from "~/app/_components/card/card-create-modal.tsx";
import CardFeed from "~/app/_components/card/card-feed";
import { DeleteDeckConfirmationModal } from "~/app/_components/deck/deck-delete-confirmation-modal";
import { EditDeckDescriptionModal } from "~/app/_components/deck/deck-edit-description-modal";
import { RenameDeckModal } from "~/app/_components/deck/deck-rename-modal";

interface PageProps {
  params: { deckId: string }
}

export default function Page({ params }: PageProps) {
  const deckId = Number(params.deckId);

  return (
    <main className="flex justify-center px-5 my-5 lg:my-8">
      <CardFeed deckId={deckId} />
      <CreateCardModal deckId={deckId} />
      <RenameDeckModal deckId={deckId} />
      <EditDeckDescriptionModal deckId={deckId} />
      <DeleteDeckConfirmationModal deckId={deckId} />
    </main>
  );
}