import type { Document } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import ConfirmModal from "./Modal/Confirm";

interface TableProps {
  documents?: Document[];
}

const DocumentTable = ({ documents = [] }: TableProps) => {
  const genRow = (document: Document, i: number) => (
    <tr key={i + 1}>
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
        <div className="font-bold">{document.content.slice(0, 25)}</div>
      </td>
      <td>
        <div className="font-bold">{document.userId}</div>
      </td>
      <td>
        <div className="tooltip" data-tip="Delete document.">
          <ConfirmModal
            title={`Delete ${document.filename}`}
            onConfirm={() => console.log("Delete document")}
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
          <th>ID</th>
          <th>Filename</th>
          <th>Index</th>
          <th>Content</th>
          <th>User ID</th>
          <th>Actions</th>
        </thead>
        <tbody>{documents?.map(genRow)}</tbody>
        <tfoot>
          <th>ID</th>
          <th>Filename</th>
          <th>Index</th>
          <th>Content</th>
          <th>User ID</th>
          <th>Actions</th>
        </tfoot>
      </table>
    </div>
  );
};

export default DocumentTable;
