import Admin from "~/interfaces/admin";

export const useAuthUser = () => {
  return useState<Admin | null>("user", () => null);
};
