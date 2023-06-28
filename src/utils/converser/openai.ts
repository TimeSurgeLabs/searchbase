import { get_encoding } from "@dqbd/tiktoken";
import type { OpenAI } from "./../ai/openai";
import type { Conversation, Document, Message, User } from "@prisma/client";
import type {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from "openai";

export const systemPrompt =
  "You are a helpful assistant. You will be given some context, as well as a chat history. You are to respond to the user's messages using both the message history provided as well as the given context. Do not tell the user about the context, they think you are a normal chatbot. Provide the users a detailed response. Try to help the user learn about their question as much as possible.";

// dirty fix. Needs improved
const tokenizer = get_encoding("cl100k_base");

// eslint-disable-next-line @typescript-eslint/require-await
async function count_tokens(content: string): Promise<number> {
  const tokens = tokenizer.encode(content);
  const length = tokens.length;
  return length;
}

const countTokens = async (
  msg: ChatCompletionRequestMessage,
  countFn: (text: string) => Promise<number>
) => {
  let tokens = 3;
  tokens += await countFn(msg.content);
  tokens += await countFn(msg.role);
  return tokens;
};

export default async function converser(
  content: string,
  conversation: Conversation & { user: User; messages: Message[] },
  results: Document[],
  ai: OpenAI
): Promise<string> {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];

  let contextTokens = await countTokens(
    messages[0] as ChatCompletionRequestMessage,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    count_tokens
  );
  let context = "Context:\n";
  contextTokens += await count_tokens(context);
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (!result) {
      break;
    }
    const resultTokens = await count_tokens(result.content);
    // open AI has significantly more tokens than others,
    // so we can get away with a higher threshold
    if (contextTokens + resultTokens > ai.maxTokens / 2) {
      continue;
    }
    context += result.content + "\n";
    contextTokens += resultTokens;
  }
  messages.push({
    role: "user",
    content: context,
  });

  const messageHistory = conversation.messages.reverse();
  const conversationHistory: ChatCompletionRequestMessage[] = [
    {
      role: "user",
      content,
    },
  ];
  let conversationTokens = await countTokens(
    conversationHistory[0] as ChatCompletionRequestMessage,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    count_tokens
  );

  for (let i = 0; i < messageHistory.length; i++) {
    const message = messageHistory[i];
    if (!message) {
      break;
    }
    const newMessage: ChatCompletionRequestMessage = {
      role: message.role as "user" | "system" | "assistant",
      content: message.content,
    };
    const messageTokens = await countTokens(
      newMessage,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      count_tokens
    );
    if (conversationTokens + messageTokens > ai.maxTokens / 2) {
      continue;
    }
    conversationHistory.push(newMessage);
    conversationTokens += messageTokens;
  }

  const req: CreateChatCompletionRequest = {
    messages: [...messages, ...conversationHistory.reverse()],
    model: ai.chatModel as "gpt-3.5-turbo",
  };

  const completion = await ai.client.createChatCompletion(req);

  const data = completion?.data?.choices[0];

  if (!data) {
    throw new Error("No completion returned");
  }

  const message = data?.message;

  if (!message) {
    throw new Error("No message returned");
  }

  return message.content;
}
