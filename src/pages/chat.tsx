/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Header from "@/components/Header";
import { useEffect } from "react";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const conversation = api.chat.getConversation.useQuery({
    id: (router.query.id as string) || "",
  });

  const onSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setMessage(input);
    setInput("");

    if (!session) {
      void signIn();
    }
    setIsLoading(true);
    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: input,
          id: conversation.data?.id,
        }),
      });
      void conversation.refetch();
      setMessage("");
    } catch (e) {
      console.error(e);
      alert(e);
    }
    setIsLoading(false);
  };

  const clear = () => {
    if (conversation?.data?.messages.length === 0) return;
    // switch pages to /chat but don't use push
    // so that the conversation is cleared
    void router.replace("/chat");
  };

  useEffect(() => {
    if (conversation?.data?.id !== router.query.id && conversation?.data?.id) {
      void router.push(`/chat?id=${conversation?.data?.id}`);
    }
  }, [conversation, router]);

  return (
    <main>
      <Header onClearChat={clear} />
      <div className="flex justify-center">
        <div className="w-3/4">
          <div className="w-full overflow-auto">
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-secondary">
                Hello! I am your friendly neighborhood Chat bot. How can I help
                you today?
              </div>
            </div>
            {conversation?.data?.messages.map((message, i) => (
              <div
                key={i}
                className={`chat ${
                  message.role !== "user" ? "chat-start" : "chat-end"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.role !== "user"
                      ? "chat-bubble-secondary"
                      : "chat-bubble-accent"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <>
                <div className="chat chat-end">
                  <div className="chat-bubble chat-bubble-accent">
                    <ReactMarkdown>{message}</ReactMarkdown>
                  </div>
                </div>
                <div className="chat chat-start">
                  <div className="chat-bubble chat-bubble-secondary">
                    <span className="loading loading-dots loading-lg"></span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="my-4 flex w-full items-center justify-center">
            <form
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={onSubmit}
              className="flex w-3/4 items-center justify-center gap-4"
            >
              <textarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                name="message"
                id="message"
                className="textarea-bordered textarea-primary textarea w-full flex-initial"
                placeholder="Message"
                onKeyDown={(event) => {
                  // if just enter, send message
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void onSubmit();
                  }
                }}
              />
              <button className="btn-primary btn self-center" type="submit">
                {" "}
                send <IconSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
