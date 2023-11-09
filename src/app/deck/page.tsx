import Link from "next/link";
import CreateDeckForm from "../_components/deck/deck-create-form";

export default function Page() {  
  return (
    <main className="flex justify-center w-full my-5 lg:my-8 px-5 lg:px-16">
      <div className="flex flex-col w-full max-w-4xl">
      <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-medium">Create flashcard deck</h1>
          <Link href="/" className="btn btn-sm normal-case">Return home</Link>
        </div>
        <CreateDeckForm />
      </div>
    </main>
  );
}