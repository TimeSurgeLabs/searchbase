import { useSession } from "next-auth/react";
import LoginButton from "./auth/Login";
import LogoutButton from "./auth/Logout";
import { IconTrash } from "@tabler/icons-react";
import Modal from "./Modal";

interface HeaderProps {
  onClearChat: () => void;
}

export default function Header({ onClearChat }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header aria-label="Page Header">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Chat
            </h1>

            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Let&apos;s Chat!
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <Modal
              buttonLabel={
                <>
                  Clear Chat <IconTrash />
                </>
              }
              buttonClassName="btn btn-error"
              id="clear-chat"
              closeOnBackdropClick
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">
                Are you sure?
              </h2>
              <p className="py-4">This action cannot be reversed.</p>
              <div className="modal-action">
                <button className="btn-error btn" onClick={onClearChat}>
                  Clear Chat <IconTrash />
                </button>
                <button className="btn-primary btn">Cancel</button>
              </div>
            </Modal>
            {!!session ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
