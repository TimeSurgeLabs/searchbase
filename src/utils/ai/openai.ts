import { Configuration, OpenAIApi } from "openai";
import { type Tiktoken, get_encoding } from "@dqbd/tiktoken";

import { processContent } from "../content";
import { BaseAI } from "./base";

export class OpenAI extends BaseAI {
  public client: OpenAIApi;
  public chatModel = "gpt-3.5-turbo";
  private embeddingsModel = "text-embedding-ada-002";
  private tokenizer: Tiktoken;

  constructor(apiKey: string) {
    super(apiKey);
    this.maxTokens = 4096;
    this.tokenizer = get_encoding("cl100k_base");
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });
    this.client = new OpenAIApi(configuration);
  }

  async get_embedding(content: string): Promise<number[]> {
    const response = await this.client.createEmbedding({
      model: this.embeddingsModel,
      input: content,
    });

    const data = response.data.data[0];
    if (!data) {
      throw new Error("No embedding returned");
    }

    return data.embedding;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async count_tokens(content: string): Promise<number> {
    const tokens = this.tokenizer.encode(content);
    const length = tokens.length;
    return length;
  }

  async completion(prompt: string): Promise<string> {
    const completion = await this.client.createChatCompletion({
      model: this.chatModel,
      messages: [{ role: "user", content: prompt }],
    });

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

  // eslint-disable-next-line @typescript-eslint/require-await
  async processContent(content: string): Promise<string[]> {
    return processContent(content, 1024, this.tokenizer);
  }
}
