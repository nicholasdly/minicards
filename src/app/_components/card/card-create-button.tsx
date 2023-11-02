"use client";

export default function CreateCardButton() {
  return (
    <button
      className="btn normal-case whitespace-nowrap"
      onClick={() => {
        (document.getElementById('create-card-modal') as HTMLDialogElement).showModal();
        (document.getElementById('create-card-modal-front-input') as HTMLInputElement).focus();
      }}
    >
      Add card
    </button>
  );
}
