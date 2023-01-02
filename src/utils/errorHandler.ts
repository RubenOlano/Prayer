import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export const handleError = (err: unknown): TRPCError => {
  let code: TRPC_ERROR_CODE_KEY;
  let message: string;

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        code = "NOT_FOUND";
        message = "Post not found";
        break;
      default:
        code = "INTERNAL_SERVER_ERROR";
        message = err.message;
    }
  } else if (err instanceof TRPCError) {
    return err;
  } else {
    code = "INTERNAL_SERVER_ERROR";
    message = "Something went wrong";
  }

  return new TRPCError({
    code,
    message,
    cause: err,
  });
};
