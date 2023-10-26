import CreateDeck from "./_components/create-deck";
import DeckList from "./_components/deck-list";
import { auth } from "@clerk/nextjs";
import Header from "./_components/header";

export default function Home() {
  const { userId } = auth();

  if (!userId) {
    return (
      <>
        <Header />
        <main className="flex flex-col items-center justify-center">
          Please log in to create decks and flashcards.
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        <CreateDeck userId={userId} />
        <DeckList userId={userId} />
      </main>
    </>
  );
}
