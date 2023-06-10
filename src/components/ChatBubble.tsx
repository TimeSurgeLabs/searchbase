import Image from "next/image";

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

export default function ChatBubble({
  variant,
  children,
  align,
  avatar,
  loading,
}: ChatBubbleProps) {
  return (
    <div className={`chat chat-${align}`}>
      {avatar && (
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image src={avatar} alt="Avatar" />
          </div>
        </div>
      )}
      <div
        className={`chat-bubble-${align} chat-bubble ${
          variant ? "chat-bubble-" + variant : ""
        }`}
      >
        {loading ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
