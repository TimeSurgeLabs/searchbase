import Modal from ".";

interface ConfirmModalProps {
  onConfirm: () => void;
  id: string;
  closeOnBackdropClick?: boolean;
  buttonLabel: React.ReactNode;
  buttonClassName?: string;
  title: string;
  description: string;
  confirmLabel?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onConfirm,
  id,
  closeOnBackdropClick,
  buttonLabel,
  buttonClassName,
  title,
  description,
  confirmLabel = "Confirm",
}) => (
  <Modal
    id={id}
    closeOnBackdropClick={closeOnBackdropClick}
    buttonLabel={buttonLabel}
    buttonClassName={buttonClassName}
  >
    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">
      {title}
    </h2>
    <p className="py-4">{description}</p>
    <div className="modal-action">
      <button className="btn-error btn" onClick={onConfirm}>
        {confirmLabel}
      </button>
      <button className="btn-primary btn">Cancel</button>
    </div>
  </Modal>
);

export default ConfirmModal;
