import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button className="btn-ghost btn" onClick={() => void signOut()}>
      Log Out <IconLogout />
    </button>
  );
};

export default LogoutButton;
