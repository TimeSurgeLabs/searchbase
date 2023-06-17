interface ModalProps {
  buttonLabel: React.ReactNode;
  buttonClassName?: string;
  id: string;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
  disabled?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  buttonLabel,
  buttonClassName = "btn btn-primary",
  id,
  children,
  closeOnBackdropClick,
  disabled,
}) => {
  return (
    <>
      <button
        className={buttonClassName}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        onClick={() => window?.[id as keyof Window]?.showModal()}
        disabled={disabled}
      >
        {buttonLabel}
      </button>
      <dialog id={id} className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box">
          {children}
        </form>
        {closeOnBackdropClick && (
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        )}
      </dialog>
    </>
  );
};

export default Modal;
