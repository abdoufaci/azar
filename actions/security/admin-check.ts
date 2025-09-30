import { currentRole } from "@/lib/auth";

export const checkIsAdmin = async () => {
  const role = await currentRole();

  if (role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
};
