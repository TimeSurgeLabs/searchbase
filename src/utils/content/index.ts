import { type Tiktoken } from "@dqbd/tiktoken";

export const processContent = (
  content: string,
  chunkSize: number,
  tokenizer: Tiktoken
): string[] => {
  const results: string[] = [];
  const decoder = new TextDecoder(); // to convert Uint8Array to string

  // convert content to tokens
  const tokens = tokenizer.encode(content);

  if (chunkSize >= tokens.length) {
    results.push(decoder.decode(tokenizer.decode(tokens)));
    return results;
  }

  for (let start = 0; start < tokens.length; start += chunkSize) {
    let end = start + chunkSize;

    if (end > tokens.length) {
      end = tokens.length;
    }

    // decode the tokens
    const decodedTokens = tokenizer.decode(tokens.slice(start, end));
    results.push(decoder.decode(decodedTokens));
  }

  return results;
};
