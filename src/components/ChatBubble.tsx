import Image from "next/image";
import { useClipboard } from "@mantine/hooks";

export interface ChatBubbleProps {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "warning"
    | "error"
    | "success"
    | "info";
  children?: React.ReactNode;
  align: "start" | "end";
  avatar?: string;
  loading?: boolean;
}

const VariantMap = {
  primary: "chat-bubble-primary",
  secondary: "chat-bubble-secondary",
  accent: "chat-bubble-accent",
  warning: "chat-bubble-warning",
  error: "chat-bubble-error",
  success: "chat-bubble-success",
  info: "chat-bubble-info",
};

export default function ChatBubble({
  variant,
  children,
  align,
  avatar,
  loading,
}: ChatBubbleProps) {
  const { copy, copied } = useClipboard({ timeout: 1000 });
  return (
    <div>
      <div className={`chat ${align === "start" ? "chat-start" : "chat-end"}`}>
        {avatar && (
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image src={avatar} alt="Avatar" />
            </div>
          </div>
        )}

        <div
          onClick={() => copy(children)}
          className={`chat-bubble cursor-pointer ${
            variant ? VariantMap[variant] : ""
          }`}
        >
          {loading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            children
          )}
        </div>
      </div>
      {copied && <span className="badge badge-success">Message Copied!</span>}
    </div>
  );
}
