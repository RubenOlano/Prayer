import { withAuth } from "next-auth/middleware";
export default withAuth(
  function middleware(req) {
    console.log(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);
