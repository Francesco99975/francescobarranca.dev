import Admin from "../../../interfaces/admin";

export default defineEventHandler(
  async (event): Promise<{ user: Admin | null }> => {
    const userWithPassword = event.context.user;

    if (!userWithPassword) {
      return {
        user: null,
      };
    }

    const { password: _password, ...userWithoutPassword } = userWithPassword;

    return {
      user: userWithoutPassword,
    };
  }
);
