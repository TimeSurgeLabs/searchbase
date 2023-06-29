import { useSession } from "next-auth/react";
import LoginButton from "./auth/Login";
import LogoutButton from "./auth/Logout";
import Link from "next/link";
import {
  IconHome,
  IconMenu2,
  IconMessage,
  IconUpload,
  IconFile,
  IconUsers,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { api } from "@/utils/api";
import AdminMenu from "./AdminMenu";
import { signIn, signOut } from "next-auth/react";

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
        <p className="mt-1.5 hidden text-sm text-gray-500 dark:text-gray-400 lg:flex">
          Your company&apos;s knowledge base
        </p>
      </div>
      <div className="navbar-end mr-2 mt-1 hidden gap-0 md:flex">
        <Link className="btn-ghost btn" href="/">
          Home <IconHome />
        </Link>
        <Link className="btn-ghost btn" href="/chat">
          Chat <IconMessage />
        </Link>
        {user?.role === "admin" && <AdminMenu />}
        {!!session ? <LogoutButton /> : <LoginButton />}
      </div>
      <div className="dropdown-bottom dropdown navbar-end mr-2 mt-1 flex md:hidden">
        <label tabIndex={0} className="btn-ghost btn">
          <IconMenu2 />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box z-30 w-52 bg-base-100 p-2 shadow"
        >
          <li>
            <Link href="/">
              <IconHome />
              Home
            </Link>
          </li>
          <li>
            <Link href="/chat">
              <IconMessage />
              Chat
            </Link>
          </li>
          {user?.role === "admin" && (
            <>
              <li>
                <Link href="/load">
                  <IconUpload /> Upload
                </Link>
              </li>
              <li>
                <Link href="/documents">
                  <IconFile />
                  Documents
                </Link>
              </li>
              <li>
                <Link href="/users">
                  <IconUsers />
                  Users
                </Link>
              </li>
            </>
          )}

          <li>
            {!!session ? (
              <a onClick={() => void signOut()}>
                <IconLogout />
                Log out
              </a>
            ) : (
              <a onClick={() => void signIn()}>
                <IconLogin />
                Log in
              </a>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
