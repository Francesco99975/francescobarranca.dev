import Admin from "interfaces/admin";

export const useAuth = () => {
  const authUser = useState<Admin | null>("admin", () => null);

  const setUser = (user: any) => {
    authUser.value = user;
  };

  const setCookie = (cookie: any) => {
    cookie.value = cookie;
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    const data: { user: Admin } = await $fetch("/auth/login", {
      method: "POST",
      body: {
        email,
        password,
        rememberMe,
      },
    });

    setUser(data.user);

    return authUser;
  };

  const logout = async () => {
    const data: { user: null } = await $fetch("/auth/logout", {
      method: "POST",
    });

    setUser(data.user);
  };

  const me = async () => {
    if (!authUser.value) {
      try {
        const data: { user: Admin | null } = await $fetch("/auth/me", {
          headers: useRequestHeaders(["cookie"]) as HeadersInit,
        });

        setUser(data.user);
      } catch (error) {
        setCookie(null);
      }
    }

    return authUser;
  };

  const isAuthenticated = () => authUser.value !== null;

  return {
    login,
    logout,
    me,
    isAuthenticated,
  };
};
