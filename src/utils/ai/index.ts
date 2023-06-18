import { BaseAI } from "./base";
import { FastChat } from "./fastchat";
import { OpenAI } from "./openai";
import { env } from "@/env.mjs";
// this will be the main AI resolver
// it will take in the current AI mode and return
// an object with methods for each mode

export default function getAI(mode: string, apiKey: string): BaseAI {
  // get the ai object and return an instantiated version
  // of the correct class

  switch (mode) {
    case "base":
      return new BaseAI(apiKey);
    case "gpt-3.5-turbo":
      return new OpenAI(apiKey);
    case "gpt-4":
      const gpt4 = new OpenAI(apiKey);
      gpt4.chatModel = "gpt-4";
      gpt4.maxTokens = 8192;
      return gpt4;
    case "gpt-3.5-turbo-16k":
      const gpt = new OpenAI(apiKey);
      gpt.chatModel = "gpt-3.5-turbo-16k";
      gpt.maxTokens = 16384;
      return gpt;
    case "fastchat-t5-v1.0":
      return new FastChat(env.AI_BASE_URL);
    default:
      return new BaseAI(apiKey);
  }
}
