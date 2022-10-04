// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { userRouter } from "./user";
import { groupRouter } from "./group";
import { postRouter } from "./post";
import { inviteRouter } from "./invite";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("users.", userRouter)
	.merge("groups.", groupRouter)
	.merge("posts.", postRouter)
	.merge("invites.", inviteRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
