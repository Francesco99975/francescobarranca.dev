import Admin from "interfaces/admin";
import { useAuthUser } from "./useAuthUser";

export const useAuth = () => {
  const authUser = useAuthUser();

  const setUser = (user: any) => {
    authUser.value = user;
  };

  const setCookie = (cookie: any) => {
    cookie.value = cookie;
  };

  const login = async (
    username: string,
    password: string,
    rememberMe: boolean
  ) => {
    const data: { user: Admin } = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username,
        password,
        rememberMe,
      },
    });

    setUser(data.user);

    return authUser;
  };

  const logout = async () => {
    const data: { user: null } = await $fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(data.user);
  };

  const me = async () => {
    if (!authUser.value) {
      try {
        const data: { user: Admin | null } = await $fetch("/api/auth/me", {
          headers: useRequestHeaders(["cookie"]) as HeadersInit,
        });

        setUser(data.user);
      } catch (error) {
        setCookie(null);
      }
    }

    return authUser;
  };

  const isAuthenticated = () => {
    return !!authUser.value;
  };

  return {
    login,
    logout,
    me,
    isAuthenticated,
  };
};
