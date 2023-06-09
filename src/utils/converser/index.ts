import type { Conversation, Document, Message, User } from "@prisma/client";
import type { BaseAI } from "@/utils/ai/base";

export const systemPrompt =
  "You are a helpful assistant who answers questions about content in the given context. Context content will be marked with 'Context:'. You do not answer any other questions. If their question is irrelevant to the context, politely tell them that you don't know and as them to ask a different question. Do not tell the user to look at the additional information you were provided, they cannot see it, so be sure to talk about it in your response. Avoid putting the word 'Context:' in your response. You are giving them an explanation, not unformatted context.";

// uses the given content to generate a new conversation and response as a string
export default async function converser(
  content: string,
  conversation: Conversation & { user: User; messages: Message[] },
  results: Document[],
  ai: BaseAI
): Promise<string> {
  // this should be adjusted until we get a good balance of accuracy and content length
  const contextMaxTokens = Math.floor(ai.maxTokens / 3);
  const maxConversationTokens = Math.floor(ai.maxTokens / 2);

  let context = "Context:\n";
  let contextTokens = await ai.count_tokens(systemPrompt + "\nContext:\n");
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (!result) {
      break;
    }
    const resultTokens = await ai.count_tokens(result.content);
    if (contextTokens + resultTokens > contextMaxTokens) {
      continue;
    }
    context += result.content + "\n";
    contextTokens += resultTokens;
  }

  const messageHistory = conversation.messages.reverse();
  const conversationHistory: string[] = [`User: ${content}\n`];
  let conversationTokens = await ai.count_tokens(
    conversationHistory[0] as string
  );

  for (let i = 0; i < messageHistory.length; i++) {
    const message = messageHistory[i];
    if (!message) {
      break;
    }
    const newMessage = `Assistant: ${message.content}\n`;
    const messageTokens = await ai.count_tokens(newMessage);
    if (conversationTokens + messageTokens > maxConversationTokens) {
      continue;
    }
    conversationHistory.push(newMessage);
    conversationTokens += messageTokens;
  }

  const messagesString = conversationHistory.reverse().join("");
  // combine the context and conversation history
  const prompt = `${systemPrompt}${context}${messagesString}`;

  // generate a response
  const response = await ai.completion(prompt);

  return response;
}
