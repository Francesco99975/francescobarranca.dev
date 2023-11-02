import { Result, failure, success } from "../../interfaces/result";
import Admin from "../../interfaces/admin";
import { ServerError } from "../../interfaces/serverError";
import { prisma } from "../db.server";

export async function getUsers(): Promise<Result<ServerError, Admin[]>> {
  try {
    return success(await prisma.admin.findMany());
  } catch (error) {
    return failure({
      code: 500,
      message: "Server error on admin get all",
      error,
    });
  }
}

export async function getUserByUsername(
  username: string
): Promise<Result<ServerError, Admin>> {
  try {
    const admin = await prisma.admin.findFirst({
      where: { username },
      include: { password: { select: { hash: true } } },
    });

    if (!admin || !admin.password)
      return failure({ code: 404, message: "Admin not found by email" });

    return success({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      password: admin.password,
    });
  } catch (error) {
    return failure({
      code: 500,
      message: "Server error on admin get by email",
      error,
    });
  }
}

export async function getUserById(
  id: string
): Promise<Result<ServerError, Admin>> {
  try {
    const admin = await prisma.admin.findFirst({
      where: { id },
      include: { password: { select: { hash: true } } },
    });

    if (!admin || !admin.password)
      return failure({ code: 404, message: "Admin not found by id" });

    return success({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      password: admin.password,
    });
  } catch (error) {
    return failure({
      code: 500,
      message: "Server error on admin get by id",
      error,
    });
  }
}
