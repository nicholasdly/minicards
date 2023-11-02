export default function DeckOptionsDropdown() {
  return (
    <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">
      <label tabIndex={0} className="btn m-1 normal-case">Edit deck</label>
      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a
            onClick={() => {
              (document.getElementById('rename-deck-modal') as HTMLDialogElement).showModal();
              (document.getElementById('rename-deck-modal-title-input') as HTMLInputElement).focus();
            }}
          >
            Rename deck
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              (document.getElementById('edit-deck-description-modal') as HTMLDialogElement).showModal();
              (document.getElementById('edit-deck-description-modal-description-input') as HTMLInputElement).focus();
            }}
          >
            Edit description
          </a>
        </li>
        <li>
          <a
            className="text-red-500 hover:text-red-500"
            onClick={() => {
              (document.getElementById('delete-deck-confirmation-modal') as HTMLDialogElement).showModal();
            }}
          >
            Delete deck
          </a>
        </li>
      </ul>
    </div>
  );
}
