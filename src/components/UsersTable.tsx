import Image from "next/image";
import type { User, Document } from "@prisma/client";
import { useSession } from "next-auth/react";
import { IconTrash, IconUser } from "@tabler/icons-react";
import ConfirmModal from "./Modal/Confirm";
import Link from "next/link";

type TableUsers = User & { Document: Document[] };

interface TableProps {
  users?: TableUsers[];
  makeAdmin: (id: string) => void;
  deleteAdmin: (id: string) => void;
  deleteUser: (id: string) => void;
}

const UsersTable = ({
  users = [],
  makeAdmin,
  deleteAdmin,
  deleteUser,
}: TableProps) => {
  const { data: session } = useSession();

  const genRow = (user: TableUsers, i: number) => (
    <tr key={i + 1}>
      <td>
        <div className="flex items-center space-x-3">
          {user.image ? (
            <div className="avatar">
              <div className="mask mask-circle h-12 w-12">
                <Image
                  src={user.image}
                  alt="Avatar Tailwind CSS Component"
                  className="h-12 w-12"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          ) : (
            <div className="placeholder avatar">
              <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                <IconUser />
              </div>
            </div>
          )}

          <div>
            <div className="font-bold">{user.name}</div>
          </div>
        </div>
      </td>
      <td>
        <a className="link" href={`mailto:${user.email || ""}`}>
          {user.email || "No Email Provided"}
        </a>
      </td>
      <td>
        <div className="tooltip" data-tip="Change role.">
          <button
            className={
              user.role === "admin"
                ? "btn-error btn-xs btn"
                : "btn-success btn-xs btn"
            }
            onClick={() =>
              user.role === "admin"
                ? void deleteAdmin(user.id)
                : void makeAdmin(user.id)
            }
            disabled={session?.user?.id === user.id && user.role === "admin"}
          >
            {user.role}
          </button>
        </div>
      </td>
      <td>
        <div className="tooltip" data-tip="View documents.">
          <Link
            href={`/documents/${user.id}`}
            className="btn-primary btn-xs btn"
          >
            {user?.Document?.length || 0} Documents
          </Link>
        </div>
      </td>
      <td>
        <div className="tooltip" data-tip="Delete user.">
          <ConfirmModal
            id={`delete-user-${user.id}`}
            title="Delete User"
            description={`Are you sure you want to delete ${
              user.name || "this user"
            }? This action is irreversible.`}
            buttonLabel={<IconTrash />}
            buttonClassName="btn-error btn-sm btn"
            onConfirm={() => void deleteUser(user.id)}
            disabled={session?.user?.id === user.id}
          />
        </div>
      </td>
    </tr>
  );

  const rows = users?.map(genRow) || [];

  return (
    <div className="overflow-x-auto">
      <table className="table-zebra table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Documents</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Documents</th>
            <th>Delete</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default UsersTable;
