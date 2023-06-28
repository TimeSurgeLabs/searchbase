/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React, { useEffect } from "react";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

import ChatHeader from "@/components/ChatHeader";
import { api } from "@/utils/api";
import ChatBubble from "@/components/ChatBubble";
import Head from "next/head";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

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
    if (!input) return;
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      window.error_modal.showModal();
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
      <Head>
        <title>Chat</title>
      </Head>
      <dialog id="error_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">Error sending chat!</h3>
          <p className="py-4">Please try again later!</p>
          <div className="modal-action">
            <button className="btn-error btn">Close</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="flex justify-center">
        <div className="flex w-full flex-col items-center justify-center rounded-xl bg-neutral p-1 text-neutral-content sm:w-3/4">
          <div className="flex w-full flex-col justify-center">
            <ChatHeader onClearChat={clear} />

            <ChatBubble align="start" variant="accent">
              Hello! I am your friendly neighborhood Chat bot. How can I help
              you today?
            </ChatBubble>
            {conversation?.data?.messages.map((message, i) => (
              <ChatBubble
                key={i}
                align={message.role === "user" ? "end" : "start"}
                variant={message.role === "user" ? "primary" : "accent"}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </ChatBubble>
            ))}
            {isLoading && (
              <>
                <ChatBubble align="end" variant="primary">
                  {message}
                </ChatBubble>
                <ChatBubble align="start" variant="accent" loading />
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
