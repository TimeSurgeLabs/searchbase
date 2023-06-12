import { useSession } from "next-auth/react";
import LoginButton from "./auth/Login";
import LogoutButton from "./auth/Logout";
import { IconTrash } from "@tabler/icons-react";
import ConfirmModal from "./Modal/Confirm";

interface HeaderProps {
  onClearChat: () => void;
}

export default function Header({ onClearChat }: HeaderProps) {
  const { data: session } = useSession();

  const clearLabel = (
    <>
      Clear Chat <IconTrash />
    </>
  );

  return (
    <header className="navbar" aria-label="Page Header">
      <div className="navbar-start ml-2 flex gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Chat
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Let&apos;s Chat!
        </p>
      </div>

      <div className="navbar-end mr-2 mt-1 flex gap-4">
        <ConfirmModal
          onConfirm={onClearChat}
          id="clear-chat"
          closeOnBackdropClick
          buttonLabel={clearLabel}
          buttonClassName="btn btn-error"
          title="Are you sure?"
          description="This action cannot be reversed."
          confirmLabel={clearLabel}
        />
        {!!session ? <LogoutButton /> : <LoginButton />}
      </div>
    </header>
  );
}
