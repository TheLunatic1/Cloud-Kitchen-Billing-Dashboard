const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, billName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
        <p className="py-4">
          Are you sure you want to permanently delete the bill for
          <br />
          <strong>"{billName || 'this bill'}"</strong>?
          <br />
          This action cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Yes, Delete Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;