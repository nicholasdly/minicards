import Link from "next/link";
import EditDeckForm from "~/app/_components/deck/deck-edit-form";
import NotFoundPage from "~/app/not-found";
import { api } from "~/trpc/server";

interface PageProps {
  params: { publicId: string }
}

export default async function Page({ params }: PageProps) {
  const { deck } = await api.deck.get.query({ publicId: params.publicId });
  if (!deck) return <NotFoundPage />;

  return (
    <>
      <main className="flex justify-center w-full my-5 lg:my-8 px-5 lg:px-16">
        <div className="flex flex-col w-full max-w-4xl">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-medium">Edit flashcard deck</h1>
            <Link href={`/deck/${deck.publicId}`} className="btn btn-sm normal-case">Return to deck</Link>
          </div>
          <EditDeckForm deck={deck} />
        </div>
      </main>
    </>
  );
}