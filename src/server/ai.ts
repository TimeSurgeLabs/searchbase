import getAI from "@/utils/ai";
import { env } from "@/env.mjs";

const globalForAI = globalThis as unknown as {
  ai: ReturnType<typeof getAI> | undefined;
};

export const ai = globalForAI.ai ?? getAI(env.AI_MODE, env.AI_API_KEY);

if (env.NODE_ENV !== "production") globalForAI.ai = ai;
