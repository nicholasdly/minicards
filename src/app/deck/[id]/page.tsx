import CardList from "~/app/_components/card-list";
import CreateCard from "~/app/_components/create-card";

interface PageProps {
  params: { id: string }
}

export default function Page({ params }: PageProps) {
  return (
    <main className="flex flex-col items-center mt-16">
      <h1 className="text-3xl font-medium mb-6">minicards</h1>
      <CreateCard deckId={Number(params.id)} />
      <CardList id={Number(params.id)} />
    </main>
  );
}