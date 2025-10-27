import { checkIsAdmin } from "@/actions/security/admin-check";
import { currentRole } from "@/lib/auth";
import { db } from "@/lib/db";

export const getWorkshops = async () => {
  await checkIsAdmin();

  return await db.workShop.findMany({
    include: {
      demands: true,
      orders: {
        include: {
          orderStage: true,
        },
      },
    },
  });
};
