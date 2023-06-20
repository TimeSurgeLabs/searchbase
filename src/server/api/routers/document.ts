import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { searchText, searchVector } from "@/utils/helpers/search";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pgvector from "pgvector/utils";

export const documentRouter = createTRPCRouter({
  load: protectedProcedure
    .input(z.object({ content: z.string(), filename: z.string() }))
    .query(async ({ input, ctx }) => {
      // check if the current user is an admin
      // get the current user from the DB and check role
      // if the user is not an admin, return an error
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      if (user.role !== "admin") {
        throw new Error("You do not have permission to load documents");
      }
      const { content, filename } = input;
      const contentChunks = await ctx.ai.processContent(content);
      // insert the content with an empty vector
      let index = 0;
      for (const chunk of contentChunks) {
        const newEmbedding = await ctx.prisma.document.create({
          data: {
            content: chunk,
            userId: ctx.session.user.id,
            index,
            filename,
          },
        });
        index += 1;
        const embedding = await ctx.ai.get_embedding(chunk);
        const updatedAt = new Date();
        const { id } = newEmbedding;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const embeddingSQL = pgvector.toSql(embedding) as string;
        await ctx.prisma
          .$executeRaw`UPDATE "Document" SET "vector" = ${embeddingSQL}::vector, "updatedAt" = ${updatedAt} WHERE "id" = ${id}`;
      }
      return {};
    }),
  searchText: protectedProcedure
    .input(z.object({ query: z.string(), limit: z.number() }))
    .query(async ({ input, ctx }) => {
      return searchText(input.query, input.limit, ctx.prisma, ctx.ai);
    }),
  searchVector: protectedProcedure
    .input(z.object({ vector: z.array(z.number()), limit: z.number() }))
    .query(async ({ input, ctx }) => {
      return searchVector(input.vector, input.limit, ctx.prisma);
    }),
  getDocuments: protectedProcedure.query(async ({ ctx }) => {
    const documents = await ctx.prisma.document.findMany({
      include: {
        user: true,
      },
    });
    return documents;
  }),
  getDocumentsByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const documents = await ctx.prisma.document.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          user: true,
        },
      });
      return documents;
    }),
  deleteDocument: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // check to make sure the user calling is an admin
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.role !== "admin") {
        throw new Error("You do not have permission to delete documents");
      }

      // delete the document
      await ctx.prisma.document.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
