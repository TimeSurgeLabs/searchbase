import { Configuration, OpenAIApi } from "openai";
import { AutoTokenizer, type PreTrainedTokenizer } from "@xenova/transformers";
import { OpenAI } from "./openai";

// This model is more of a proof of concept and isn't super practical

export class FastChat extends OpenAI {
  // for some reason the tokenizer is missing in the repo
  // but it uses the same one as Google's FLAN-T5
  private tokensModel = "google/flan-t5-base";
  private localTokenizer: PreTrainedTokenizer | null = null;

  constructor(basePath: string) {
    if (!basePath) {
      throw new Error("Base path is required for FastChat");
    }
    // api key is not needed for fastchat
    // since the API is the same, we can just
    // change the parameters here
    super("EMPTY");
    // fastchat-t5 is only capable of 2048 tokens
    // however, we need to allow 512 for the response
    this.maxTokens = 1536;
    this.embeddingsModel = "fastchat-t5-3b-v1.0";
    this.chatModel = "fastchat-t5-3b-v1.0";
    this.chunkSize = 512;
    this.useChat = false;
    // override the client to use a different base path
    const configuration = new Configuration({
      apiKey: this.apiKey,
      basePath,
    });
    this.client = new OpenAIApi(configuration);
  }

  async count_tokens(content: string): Promise<number> {
    if (!this.localTokenizer) {
      this.localTokenizer = await AutoTokenizer.from_pretrained(
        this.tokensModel
      );
    }
    const tokens = this.localTokenizer.encode(content);
    return tokens.length;
  }
}
