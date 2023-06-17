// define chat routers here
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { searchText } from "@/utils/helpers/search";
import converser from "@/utils/converser";

export const chatRouter = createTRPCRouter({
  getConversation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      // if ID is not an empty string, get the conversation from the database
      if (id !== "") {
        const conversation = await ctx.prisma.conversation.findUnique({
          where: {
            id,
          },
          include: {
            messages: true,
            user: true,
          },
        });
        // make sure the user is the owner of the conversation
        if (conversation?.userId !== ctx.session.user.id) {
          throw new Error(
            "You do not have permission to view this conversation"
          );
        }
        return conversation;
      }
      // create a new conversation
      const newConversation = await ctx.prisma.conversation.create({
        data: {
          name: "New Conversation",
          userId: ctx.session.user.id,
          messages: {
            create: [],
          },
        },
        include: {
          messages: true,
          user: true,
        },
      });
      return newConversation;
    }),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .query(async ({ input, ctx }) => {
      // get the conversation from the database
      const conversation = await ctx.prisma.conversation.findUnique({
        where: {
          id: input.id,
        },
        include: {
          messages: true,
          user: true,
        },
      });

      // make sure the user is the owner of the conversation
      if (conversation?.userId !== ctx.session.user.id) {
        throw new Error("You are not the owner of this conversation");
      }

      // update the conversation name

      const updatedConversation = await ctx.prisma.conversation.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
        include: {
          messages: true,
          user: true,
        },
      });

      return updatedConversation;
    }),
  sendMessage: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id: convoID, content } = input;

      // get the conversation from the database
      const conversation = await ctx.prisma.conversation.findUnique({
        where: {
          id: convoID,
        },
        include: {
          messages: true,
          user: true,
        },
      });

      // make sure the user is the owner of the conversation
      if (conversation?.userId !== ctx.session.user.id) {
        throw new Error("You are not the owner of this conversation");
      }

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      // before searching, add the new user message to the database
      await ctx.prisma.message.create({
        data: {
          content,
          role: "user",
          conversationId: convoID,
        },
      });

      // use the content to search the database
      const searchResults = await searchText(content, 1000, ctx.prisma, ctx.ai);

      const newMessageContent = await converser(
        content,
        conversation,
        searchResults,
        ctx.ai
      );

      const newMessage = await ctx.prisma.message.create({
        data: {
          content: newMessageContent,
          conversationId: convoID,
          role: "assistant",
        },
      });

      return newMessage;
    }),
});
