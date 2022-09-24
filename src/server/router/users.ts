import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedUsersRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query("getUsers", {
    resolve({ ctx }) {
      return ctx.prisma.user.findMany();
    },
  });
