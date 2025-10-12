import { checkIsAdmin } from "@/actions/security/admin-check";
import { db } from "@/lib/db";

export const getEmployeesAndClients = async () => {
  await checkIsAdmin();

  const users = await db.user.findMany({
    where: {
      role: {
        in: ["CLIENT", "EMPLOYEE"],
      },
    },
    include: {
      workShop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const clients = users.filter((user) => user.role === "CLIENT");
  const employees = users.filter((user) => user.role === "EMPLOYEE");

  return { clients, employees };
};
