import type { Document, User } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import ConfirmModal from "./Modal/Confirm";
import Image from "next/image";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";

type TableDocument = Document & { user: User };

interface TableProps {
  documents?: TableDocument[];
  refetch: () => Promise<void>;
}

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

const DocumentTable = ({ documents = [], refetch }: TableProps) => {
  const deleteDocument = async (id: string) => {
    const url = `/api/document/delete?id=${id}`;
    await fetch(url, {
      method: "DELETE",
    });
  };

  const deleteSelected = async () => {
    const checkboxes = document.querySelectorAll(".checkbox");
    const ids: string[] = [];
    checkboxes.forEach((checkbox) => {
      if ((checkbox as HTMLInputElement).checked) {
        const name = checkbox.getAttribute("name");
        name && ids.push(name);
      }
    });
    await Promise.all(
      ids.map(async (id) => {
        try {
          deleteDocument && (await deleteDocument(id));
        } catch (e) {
          console.log(e);
        }
      })
    );
    // HACK. TODO: Fix this.
    window.location.reload();
  };

  const genRow = (document: TableDocument, i: number) => (
    <tr key={i + 1}>
      <td>
        <div className="flex items-center space-x-3">
          <input name={document.id} type="checkbox" className="checkbox" />
        </div>
      </td>
      <td>
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-bold">{document.id}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="font-bold">{document.filename || "No Filename"}</div>
      </td>
      <td>
        <div className="font-bold">{document.index}</div>
      </td>
      <td>
        <div className="font-bold">
          {document.content.slice(0, 25).trim()}...
        </div>
      </td>
      <td>
        <Link
          href={`/documents/${document.userId}`}
          className="flex items-center space-x-3 hover:cursor-pointer"
        >
          {document.user.image ? (
            <div className="avatar">
              <div className="mask mask-circle h-12 w-12">
                <Image
                  src={document.user.image}
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
            <div className="font-bold">{document.user.name}</div>
          </div>
        </Link>
      </td>
      <td>
        <div className="tooltip" data-tip="Delete document.">
          <ConfirmModal
            title={`Delete ${document.filename}`}
            onConfirm={() => {
              deleteDocument && void deleteDocument(document.id);
              void refetch();
            }}
            id={document.id}
            buttonLabel={<IconTrash />}
            buttonClassName="btn-error btn-sm btn"
            description="Are you sure you want to delete this document?"
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto">
      <table className="table-zebra table">
        <thead>
          <th>
            <input
              onClick={(e) => {
                if ((e.target as HTMLInputElement).checked) {
                  checkAll();
                } else {
                  uncheckAll();
                }
              }}
              type="checkbox"
              className="checkbox"
            />
          </th>
          <th>ID</th>
          <th>Filename</th>
          <th>Index</th>
          <th>Content</th>
          <th>User</th>
          <th>
            <div className="tooltip tooltip-bottom" data-tip="Delete Selected">
              <ConfirmModal
                title="Delete Selected"
                onConfirm={() => {
                  void deleteSelected();
                }}
                id="deleteSelected"
                buttonLabel={<IconTrash />}
                buttonClassName="btn-error btn-sm btn"
                description="Are you sure you want to delete these documents? This action cannot be undone."
              />
            </div>
          </th>
        </thead>
        <tbody>{documents?.map(genRow)}</tbody>
        <tfoot>
          <th />
          <th>ID</th>
          <th>Filename</th>
          <th>Index</th>
          <th>Content</th>
          <th>User</th>
          <th>Actions</th>
        </tfoot>
      </table>
    </div>
  );
};

export default DocumentTable;
