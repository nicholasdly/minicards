import CardFeed from "~/app/_components/card/card-feed";

interface PageProps {
  params: { publicId: string }
}

export default function Page({ params }: PageProps) {
  return (
    <main className="flex justify-center px-5 my-5 lg:my-8">
      <CardFeed id={params.publicId} />
    </main>
  );
}