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
    default:
      return new BaseAI(apiKey);
  }
}
