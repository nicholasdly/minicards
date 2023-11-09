"use client";

import { api } from "~/trpc/react";
import LoadingScreen from "../loading";
import dayjs from "dayjs";
import Flashcards from "./flashcards";
import Link from "next/link";
import Image from "next/image";
import { HelpIcon, SettingsIcon, ShareIcon, ShuffleIcon, UnknownIcon } from "../shared/icons";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import NotFoundPage from "~/app/not-found";

interface CardFeedProps {
  id: string;
}

export default function CardFeed({ id }: CardFeedProps) {
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const openHelpModal = () => setHelpModalOpen(true);
  const closeHelpModal = () => setHelpModalOpen(false);

  const query = api.deck.get.useQuery({ publicId: id });
  if (query.isLoading) return <LoadingScreen />;
  if (!query.data?.deck) return <NotFoundPage />;
  const { deck, creator } = query.data;


  return (
    <>
      <div className="flex flex-col w-full max-w-2xl">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">{deck.title}</h1>
          <span className="text-sm">Created on {dayjs(deck.createdAt).format("MMMM D, YYYY")}</span>
          <div className="flex gap-1 mt-1.5">
            <div className="badge badge-ghost rounded-full">{deck.isPublic ? "Public" : "Private"}</div>
            <div className="badge badge-ghost rounded-full">{deck.cards.length} cards</div>
          </div>
        </div>
        <p className="mt-4 mb-6">{deck.description}</p>
        <Flashcards cards={deck.cards} />
        <div className="flex justify-between mt-6 mx-4">
          <button className="hover:text-neutral-400 tooltip" data-tip="Shuffle">
            <ShuffleIcon size={28} />
          </button>
          <div className="flex gap-3">
            <Link href={`./${id}/edit`} className="hover:text-neutral-400 rounded-full tooltip" data-tip="Edit Deck">
              <SettingsIcon size={28} />
            </Link>
            <button className="hover:text-neutral-400 rounded-full tooltip" data-tip="Help" onClick={openHelpModal}>
              <HelpIcon size={28} />
            </button>
          </div>
        </div>
        <div className="divider" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {creator ? (
              <>
                <Image
                  src={creator.imageUrl}
                  alt="Profile picture"
                  className="rounded-full"
                  width={64}
                  height={64}
                />
                <div>
                  <p className="text-xs">Created by</p>
                  <p>{creator.firstName} {creator.lastName}</p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-full outline">
                  <UnknownIcon size={64} />
                </div>
                <div>
                  <p className="text-xs">Created by</p>
                  <p>Anonymous</p>
                </div>
              </>
            )}
          </div>
          <button
            className="btn tooltip normal-case"
            data-tip="Share"
            disabled={!deck.isPublic}
            onClick={() => {
              void navigator.clipboard.writeText(window.location.toString());
              toast.success("Copied deck link to clipboard!");
            }}
          >
            <ShareIcon />
          </button>
        </div>
        <div className="divider" />
        <div className={`overflow-x-auto ${deck.cards.length === 0 ? 'hidden' : 'block'}`}>
          <table className="table">
            <thead>
              <tr>
                <th>Front</th>
                <th>Back</th>
              </tr>
            </thead>
            <tbody>
              {deck.cards.map(card => (
                <tr key={card.id}>
                  <td>{card.front}</td>
                  <td>{card.back}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog as="div" className="relative z-10" open={isHelpModalOpen} onClose={closeHelpModal}>
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-base-100 p-6 align-middle text-center">
              <Dialog.Title as="h3" className="text-lg font-medium">Help</Dialog.Title>
              <div className="flex flex-col mt-4 text-sm gap-1">
                <p>Press <kbd className="kbd kbd-sm">Space</kbd> to flip the flashcard.</p>
                <p>Press <kbd className="kbd kbd-sm">▶︎</kbd> to go to the next flashcard.</p>
                <p>Press <kbd className="kbd kbd-sm">◀︎</kbd> to go to the previous flashcard.</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  className="btn btn-block normal-case"
                  onClick={closeHelpModal}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}