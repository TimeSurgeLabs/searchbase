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
  children: React.ReactNode;
  align: "start" | "end";
  avatar?: string;
}

export default function ChatBubble({
  variant,
  children,
  align,
  avatar,
}: ChatBubbleProps) {
  return (
    <div
      className={`chat-bubble chat-bubble-${
        variant || "primary"
      } chat-${align}`}
    >
      {avatar && (
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image src={avatar} alt="Avatar" />
          </div>
        </div>
      )}
      <div className="chat-bubble">{children}</div>
    </div>
  );
}
