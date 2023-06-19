import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const loadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  const { content, filename } = req.body as {
    content: string;
    filename: string;
  };
  if (content === undefined) {
    res.status(400).json({ message: "Missing content" });
    return;
  }

  try {
    const response = await caller.document.load({ content, filename });
    res.status(200).json(response);
  } catch (cause) {
    // Another error occurred
    console.error(cause);
    res.status(500).json({ message: "Internal server error", error: cause });
  }
};

export default loadHandler;
