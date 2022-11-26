import { router } from ".";
import { commentRouter } from "./comment";
import { groupRouter } from "./group";
import { inviteRouter } from "./invite";
import { postRouter } from "./post";
import { shareRouter } from "./share";
import { userRouter } from "./user";

export const appRouter = router({
	users: userRouter,
	groups: groupRouter,
	posts: postRouter,
	invites: inviteRouter,
	comments: commentRouter,
	shares: shareRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
