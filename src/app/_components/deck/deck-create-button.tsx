"use client";

export function CreateDeckButton() {
  return (
    <button
      className="btn normal-case"
      onClick={() => {
        (document.getElementById('create-deck-modal') as HTMLDialogElement).showModal();
        (document.getElementById('create-deck-modal-title-input') as HTMLInputElement).focus();
      }}
    >
      <span className="font-medium">Create new deck</span>
    </button>
  );
}
