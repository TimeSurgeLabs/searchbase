import { documentRouter } from "@/server/api/routers/document";
import { chatRouter } from "@/server/api/routers/chat";
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  document: documentRouter,
  chat: chatRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
