"use client";

import { CirclePlusIcon } from "../icons";

export default function CreateCardButton() {
  return (
    <div className="tooltip" data-tip="Add card">
      <button
        className="btn btn-sm btn-circle btn-ghost normal-case whitespace-nowrap"
        onClick={() => {
          (document.getElementById('create-card-modal') as HTMLDialogElement).showModal();
          (document.getElementById('create-card-modal-front-input') as HTMLInputElement).focus();
        }}
      >
        <CirclePlusIcon />
      </button>
    </div>
  );
}
