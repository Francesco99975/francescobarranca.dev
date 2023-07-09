import Admin from "../../../interfaces/admin";
import { serialize, sign } from "../../utils/session";
import { getUserByEmail } from "./index.get";
import * as bcrypt from "bcryptjs";

export default defineEventHandler(
  async (event): Promise<{ user: Admin } | Error> => {
    const body = await readBody<{
      email: string;
      password: string;
      rememberMe: boolean;
    }>(event);

    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return createError({
        statusCode: 400,
        message: "Email address and password are required",
      });
    }

    const result = await getUserByEmail(email);

    if (result.isError()) {
      return createError({
        statusCode: 401,
        message: "Bad credentials",
      });
    }

    const user = result.value;

    if (!user.password) {
      return createError({
        statusCode: 401,
        message: "Bad credentials",
      });
    }

    const verified = await bcrypt.compare(password, user.password);

    if (!verified) {
      return createError({
        statusCode: 401,
        message: "Bad credentials",
      });
    }

    const config = useRuntimeConfig();

    const session = serialize({ userId: user.id });
    const signedSession = sign(session, config.cookieSecret);

    setCookie(event, config.cookieName, signedSession, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: rememberMe
        ? new Date(Date.now() + config.cookieRememberMeExpires)
        : new Date(Date.now() + config.cookieExpires),
    });

    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
    };
  }
);
