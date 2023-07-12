import { Result, failure, success } from "../../interfaces/Result";
import Admin from "../../interfaces/admin";
import { ServerError } from "../../interfaces/serverError";
import { prisma } from "../db.server";

export async function getUsers(): Promise<Result<ServerError, Admin[]>> {
  try {
    const users = await prisma.admin.findMany();

    if (!users) return failure({ message: "No users found", code: 404 });

    return success(users);
  } catch (error) {
    return failure({
      message: "An error occurred while retreiving users",
      error,
      code: 500,
    });
  }
}

export async function getUserByEmail(
  email: string
): Promise<Result<ServerError, Admin>> {
  try {
    const user = await prisma.admin.findFirst({ where: { email } });

    if (!user)
      return failure({
        message: `User with email: ${email} not found`,
        code: 404,
      });

    return success(user);
  } catch (error) {
    return failure({
      message: `An error occurred while retreiving a user with email: ${email}`,
      error,
      code: 500,
    });
  }
}
export async function getUserById(
  id: string
): Promise<Result<ServerError, Admin>> {
  try {
    const user = await prisma.admin.findFirst({ where: { id } });

    if (!user) return failure({ message: "User not found", code: 404 });

    return success(user);
  } catch (error) {
    return failure({
      message: "An error occurred while retreiving user by ID",
      error,
      code: 500,
    });
  }
}
