import { IconLogin } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

const LoginButton = () => {
  return (
    <button className="btn-ghost btn" onClick={() => void signIn()}>
      Log In <IconLogin />
    </button>
  );
};

export default LoginButton;
