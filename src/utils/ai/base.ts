/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/require-await */
export class BaseAI {
  apiKey: string;
  public maxTokens: number = 2048;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async get_embedding(content: string): Promise<number[]> {
    // Implementation for fetching the embedding using the API
    // Replace the following placeholder code with your actual API call
    const embedding: number[] = [1, 2, 3, 4, 5];
    return embedding;
  }

  async count_tokens(content: string): Promise<number> {
    // Implementation for counting tokens using the API
    // Replace the following placeholder code with your actual API call
    const tokenCount: number = 10;
    return tokenCount;
  }

  async completion(prompt: string): Promise<string> {
    // Implementation for generating completion using the API
    // Replace the following placeholder code with your actual API call
    const completion: string = "This is a completion.";
    return completion;
  }

  async processContent(content: string): Promise<string[]> {
    return [];
  }
}
