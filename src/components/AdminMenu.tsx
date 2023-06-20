import {
  IconSettings,
  IconUsers,
  IconUpload,
  IconFile,
} from "@tabler/icons-react";
import Link from "next/link";

const AdminMenu = () => {
  return (
    <div className="dropdown-hover dropdown">
      <label tabIndex={0} className="btn-ghost btn">
        Admin <IconSettings />
      </label>
      <ul className="dropdown-content menu rounded-box z-50 w-48 bg-base-100 p-2 shadow">
        <li>
          <Link className="flex gap-2" href="/load">
            Upload <IconUpload />
          </Link>
        </li>
        <li>
          <Link className="flex gap-2" href="/documents">
            Documents <IconFile />
          </Link>
        </li>
        <li>
          <Link className="flex gap-2" href="/users">
            Users <IconUsers />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu;
