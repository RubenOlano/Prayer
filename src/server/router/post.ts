import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import {
  createPostOutput,
  createPostOutputSchema,
  createPostSchema,
  deletePostSchema,
  fetchAuthorPostsSchema,
  fetchGroupPostsSchema,
  fetchPostWithIdSchema,
} from "../../schema/post.schema";
import { createProtectedRouter } from "./context";

export const postRouter = createProtectedRouter()
  .mutation("createPost", {
    input: createPostSchema,
    resolve: async ({ ctx, input }) => {
      const { userId, groupId, content, annonymous, duration, title } = input;
      let new_duration = duration;
      try {
        if (!new_duration) {
          // Default duration is 1 week
          new_duration = 604800000;
        }

        const final_day = new Date(Date.now() + new_duration);

        const post = await ctx.prisma.post.create({
          data: {
            author: {
              connect: {
                id: userId,
              },
            },
            Group: {
              connect: {
                id: groupId,
              },
            },
            content,
            annonymous,
            Duration: final_day,
            title,
          },
        });

        await ctx.prisma.group.update({
          where: {
            id: groupId,
          },
          data: {
            posts: {
              connect: {
                id: post.id,
              },
            },
          },
        });

        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            Posts: {
              connect: {
                id: post.id,
              },
            },
          },
        });
        return {
          annonymous: post.annonymous,
          content: post.content,
          groupId: post.groupId,
          postId: post.id,
          userId: post.authorId,
        } as createPostOutput;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: error.message,
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          }
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            cause: error,
          });
        }
      }
    },
    output: createPostOutputSchema,
  })
  .query("getGroupPosts", {
    input: fetchGroupPostsSchema,
    resolve: async ({ ctx, input }) => {
      const { groupId } = input;
      try {
        const posts = await ctx.prisma.post.findMany({
          where: {
            Group: {
              id: groupId,
            },
          },
          include: {
            author: true,
          },
        });
        return posts;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: error.message,
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          }
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    },
  })
  .query("getAnonPosts", {
    input: fetchGroupPostsSchema,
    resolve: async ({ ctx, input }) => {
      const { groupId } = input;
      try {
        const posts = await ctx.prisma.post.findMany({
          where: {
            Group: {
              id: groupId,
            },
            annonymous: true,
          },
          select: {
            content: true,
            title: true,
            Duration: true,
            id: true,
          },
        });
        return posts;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: error.message,
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          }
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    },
  })
  .query("getAuthorPosts", {
    input: fetchAuthorPostsSchema,
    resolve: async ({ ctx, input }) => {
      const { userId } = input;
      try {
        const posts = await ctx.prisma.post.findMany({
          where: {
            authorId: userId,
          },
          include: {
            Group: true,
          },
        });
        return posts;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: error.message,
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          }
        }
      }
    },
  })
  .query("getPost", {
    input: fetchPostWithIdSchema,
    resolve: async ({ ctx, input }) => {
      const { postId, userId } = input;
      try {
        const post = await ctx.prisma.post.findUnique({
          where: {
            id: postId,
          },
          include: {
            Group: {
              include: {
                GroupMembers: true,
              },
            },
          },
        });

        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }
        const isMember = post.Group?.GroupMembers.some((member) => {
          return member.userId === userId;
        });
        if (!isMember) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not a member of this group",
          });
        }

        return post;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: error.message,
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          }
        }
      }
    },
  })
  .mutation("deletePost", {
    input: deletePostSchema,
    resolve: async ({ ctx, input }) => {
      const { postId } = input;
      try {
        const post = await ctx.prisma.post.findUnique({
          where: {
            id: postId,
          },
        });
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }
        console.log(post);

        // await ctx.prisma.group.update({
        //   where: {
        //     id: post.groupId,
        //   },
        //   data: {
        //     posts: {
        //       disconnect: {
        //         id: postId,
        //       },
        //     },
        //   },
        // });

        await ctx.prisma.post.delete({
          where: {
            id: postId,
          },
        });

        return true;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: error.message,
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          }
        }
      }
    },
  });
