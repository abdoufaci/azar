import { checkIsAdmin } from "@/actions/security/admin-check";
import { currentRole } from "@/lib/auth";
import { db } from "@/lib/db";

export const getWorkshops = async (orders?: boolean) => {
  await checkIsAdmin();

  return await db.workShop.findMany({
    include: {
      demands: true,
      ...(!!orders && {
        orders: {
          include: {
            orderStage: true,
          },
        },
      }),
    },
  });
};
