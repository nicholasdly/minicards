"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GarbageIcon } from "../shared/icons";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { MIN_DECK_SIZE } from "~/constants";

export default function CreateDeckForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<{ front: string, back: string }[]>([
    { front: '', back: '' },
    { front: '', back: '' },
    { front: '', back: '' },
  ]);

  const createDeck = api.deck.create.useMutation({
    onSuccess: () => {
      setTitle("");
      setDescription("");
      router.push("/");
      router.refresh();
      toast.success("Successfully created deck!");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const message = JSON.parse(error.message)[0].message as string;
      toast.error(message ? message : "Something went wrong!");
    },
  });

  return (
    <div className="form-control flex flex-col">
      <input
        type="text"
        placeholder="Title"
        className="input input-bordered mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        className="input input-bordered mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex flex-col gap-3">
        {cards.map((card, index) => (
          <div key={index} className="bg-base-200 p-3 rounded-lg">
            <div className="flex px-3 items-center justify-between">
              <div className="text-lg font-medium">{index + 1}</div>
              <button
                className="hover:text-red-500"
                onClick={() => {
                  if (cards.length > MIN_DECK_SIZE) {
                    setCards(cards.toSpliced(index, 1))
                  } else {
                    toast.error(`A deck must have atleast ${MIN_DECK_SIZE} cards!`);
                  }
                }}
              >
                <GarbageIcon size={20} />
              </button>
            </div>
            <div className="divider mt-1" />
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Front"
                className="input input-bordered min-w-0"
                value={card.front}
                onChange={(e) => setCards(cards.toSpliced(index, 1, { front: e.target.value, back: card.back }))}
              />
              <input
                type="text"
                placeholder="Back"
                className="input input-bordered min-w-0"
                value={card.back}
                onChange={(e) => setCards(cards.toSpliced(index, 1, { front: card.front, back: e.target.value }))}
              />
            </div>
          </div>
        ))}
        <button
          className="flex-1 btn normal-case"
          onClick={() => setCards([...cards, { front: '', back: '' }])}
        >
          Add card
        </button>
      </div>
      <button
        className="btn btn-wide normal-case mt-6 self-end"
        disabled={createDeck.isLoading}
        onClick={() => createDeck.mutate({ title, description, cards })}
      >
        {createDeck.isLoading ? <span className="loading" /> : "Create deck"}
      </button>
    </div>
  );
}