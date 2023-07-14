import { getUserByUsername } from "../../modules/user";
import { compare } from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username: string;
    password: string;
    rememberMe: boolean;
  }>(event);

  const { username, password, rememberMe } = body;

  if (!username || !password) {
    return createError({
      statusCode: 400,
      message: "Email address and password are required",
    });
  }

  const result = await getUserByUsername(username);

  if (result.isError()) {
    return createError({
      statusCode: result.error.code,
      message: result.error.message,
    });
  }

  const userWithPassword = result.value;

  if (!userWithPassword || !userWithPassword.password) {
    return createError({
      statusCode: 401,
      message: "Bad user data",
    });
  }

  const verified = await compare(password, userWithPassword.password.hash);

  if (!verified) {
    return createError({
      statusCode: 401,
      message: "Bad credentials",
    });
  }

  const config = useRuntimeConfig();

  const session = serialize({ userId: userWithPassword.id });
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return {
    user: userWithoutPassword,
  };
});
