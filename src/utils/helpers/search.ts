import type { PrismaClient, Document } from "@prisma/client";
import type { BaseAI } from "@/utils/ai/base";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pgvector from "pgvector/utils";

export const searchVector = async (
  vector: number[],
  limit: number,
  prisma: PrismaClient
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const embeddingSQL = pgvector.toSql(vector) as string;
  const resp: Document[] =
    await prisma.$queryRaw`SELECT * FROM "Document" ORDER BY "vector" <-> ${embeddingSQL} LIMIT ${limit}`;
  return resp;
};

export const searchText = async (
  query: string,
  limit: number,
  prisma: PrismaClient,
  ai: BaseAI
) => {
  const embedding = await ai.get_embedding(query);
  return searchVector(embedding, limit, prisma);
};
