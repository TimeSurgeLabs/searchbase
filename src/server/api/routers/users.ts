import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  makeAdmin: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id: currentUserID } = ctx.session.user;
      // get the user
      const currentUser = await ctx.prisma.user.findUnique({
        where: {
          id: currentUserID,
        },
      });
      if (!currentUser) {
        throw new Error("User not found");
      }
      // if the current user is the first user or an admin, they can make other users admins
      if (currentUser.role !== "admin") {
        // check the number of users in the database
        const users = await ctx.prisma.user.findMany();
        if (users.length > 1) {
          throw new Error(
            "You do not have permission to make other users admins"
          );
        }
      }
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      if (user.role === "admin") {
        throw new Error("User is already an admin");
      }
      await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: "admin",
        },
      });
      return { success: true };
    }),

  removeAdmin: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // make sure the current user is an admin
      // if not, return an error
      const { id: currentUserID } = ctx.session.user;
      const currentUser = await ctx.prisma.user.findUnique({
        where: {
          id: currentUserID,
        },
      });
      if (!currentUser) {
        throw new Error("User not found");
      }
      if (currentUser.role !== "admin") {
        throw new Error("You do not have permission to remove admins");
      }

      // make sure the user is not the first user
      // if so, return an error
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: "user",
        },
      });

      return { success: true };
    }),
});
