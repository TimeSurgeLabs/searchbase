import Image from "next/image";
import type { User, Document } from "@prisma/client";
import { useSession } from "next-auth/react";
import { IconUser } from "@tabler/icons-react";

type TableUsers = User & { Document: Document[] };

interface TableProps {
  users?: TableUsers[];
  makeAdmin: (id: string) => void;
  deleteAdmin: (id: string) => void;
}

const UsersTable = ({ users = [], makeAdmin, deleteAdmin }: TableProps) => {
  const { data: session } = useSession();

  const genRow = (user: TableUsers, i: number) => (
    <tr key={i + 1}>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
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
      <th>
        <div className="tooltip" data-tip="View documents.">
          <button
            disabled={!user?.Document?.length}
            className="btn-primary btn-xs btn"
          >
            {user?.Document?.length || 0} Documents
          </button>
        </div>
      </th>
    </tr>
  );

  const rows = users?.map(genRow) || [];

  const checkAll = () => {
    const checkboxes = document.querySelectorAll(".checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.setAttribute("checked", "true");
    });
  };

  const uncheckAll = () => {
    const checkboxes = document.querySelectorAll(".checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.removeAttribute("checked");
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-zebra table">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) =>
                    e.currentTarget.checked ? checkAll() : uncheckAll()
                  }
                />
              </label>
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Documents</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Documents</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default UsersTable;
