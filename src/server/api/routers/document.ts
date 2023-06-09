import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { searchText, searchVector } from "@/utils/helpers/search";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pgvector from "pgvector/utils";

export const documentRouter = createTRPCRouter({
  load: protectedProcedure
    .input(z.object({ content: z.string() }))
    .query(async ({ input, ctx }) => {
      const { content } = input;
      // insert the content with an empty vector
      const newEmbedding = await ctx.prisma.document.create({
        data: {
          content,
        },
      });
      const embedding = await ctx.ai.get_embedding(content);
      const updatedAt = new Date();
      const { id } = newEmbedding;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const embeddingSQL = pgvector.toSql(embedding) as string;
      await ctx.prisma
        .$executeRaw`UPDATE "Document" SET "vector" = ${embeddingSQL}::vector, "updatedAt" = ${updatedAt} WHERE "id" = ${id}`;

      return {
        id,
        content,
        vector: embedding,
      };
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
});
