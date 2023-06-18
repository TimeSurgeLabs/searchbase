import { Configuration, OpenAIApi } from "openai";
import { type Tiktoken, get_encoding } from "@dqbd/tiktoken";

import { processContent } from "../content";
import { BaseAI } from "./base";

export class OpenAI extends BaseAI {
  public client: OpenAIApi;
  public chatModel = "gpt-3.5-turbo"; // default chat model
  public embeddingsModel = "text-embedding-ada-002"; // default embeddings model
  public useChat = true; // whether to use the chat model or not
  public chunkSize = 1024; // used to determine embedding chunk size
  public returnTokens = 512; // used to determine how many tokens to return. Only used for non-chat models
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
    if (this.useChat) {
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

    const completion = await this.client.createCompletion({
      model: this.chatModel,
      prompt,
      max_tokens: this.returnTokens,
    });

    const data = completion?.data?.choices[0];

    if (!data) {
      throw new Error("No completion returned");
    }

    const text = data?.text;

    if (!text) {
      throw new Error("No text returned");
    }

    return text;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async processContent(content: string): Promise<string[]> {
    return processContent(content, this.chunkSize, this.tokenizer);
  }
}
