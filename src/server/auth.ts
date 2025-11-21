import { getServerSession, type NextAuthOptions } from "next-auth";
import { authConfig } from "./auth.config";

export const authOptions: NextAuthOptions = {
  ...authConfig,
  pages: {
    signIn: "/auth/signin",
  },
};

export const getServerAuthSession = (ctx: {
  req: any;
  res: any;
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};