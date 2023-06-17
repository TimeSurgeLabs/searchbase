import { useSession } from "next-auth/react";
import LoginButton from "./auth/Login";
import LogoutButton from "./auth/Logout";
import Link from "next/link";
import {
  IconHome,
  IconMessage,
  IconUpload,
  IconUsers,
} from "@tabler/icons-react";
import { api } from "@/utils/api";

export default function Header() {
  const { data: session } = useSession();
  const { data: user } = api.users.getUser.useQuery({
    id: session?.user?.id || "",
  });

  return (
    <header className="navbar" aria-label="Page Header">
      <div className="navbar-start ml-2 flex gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Searchbase
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Your company&apos;s knowledge base
        </p>
      </div>
      <div className="navbar-end mr-2 mt-1 flex gap-0">
        <Link className="btn-ghost btn" href="/">
          Home <IconHome />
        </Link>
        <Link className="btn-ghost btn" href="/chat">
          Chat <IconMessage />
        </Link>
        {user?.role === "admin" && (
          <>
            <Link className="btn-ghost btn" href="/load">
              Upload <IconUpload />
            </Link>
            <Link className="btn-ghost btn" href="/users">
              Users <IconUsers />
            </Link>
          </>
        )}
        {!!session ? <LogoutButton /> : <LoginButton />}
      </div>
    </header>
  );
}
