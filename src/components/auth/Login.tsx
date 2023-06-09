import { IconLogin } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

const LoginButton = () => {
  return (
    <button className="btn-neutral btn" onClick={() => void signIn()}>
      Log In <IconLogin />
    </button>
  );
};

export default LoginButton;
