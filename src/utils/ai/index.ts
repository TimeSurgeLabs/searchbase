import { BaseAI } from "./base";
import { OpenAI } from "./openai";
// this will be the main AI resolver
// it will take in the current AI mode and return
// an object with methods for each mode

export default function getAI(mode: string, apiKey: string): BaseAI {
  // get the ai object and return an instantiated version
  // of the correct class

  switch (mode) {
    case "base":
      return new BaseAI(apiKey);
    case "openai":
      return new OpenAI(apiKey);
    case "gpt-4":
      const gpt4 = new OpenAI(apiKey);
      gpt4.chatModel = "gpt-4";
      gpt4.maxTokens = 8192;
      return gpt4;
    default:
      return new BaseAI(apiKey);
  }
}
