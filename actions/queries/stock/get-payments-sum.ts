import { db } from "@/lib/db";
import { isToday } from "date-fns";

export const getPaymentsSum = async () => {
  const deposits = await db.desk.findMany({
    where: {
      type: "DEPOSIT",
    },
    select: {
      createdAt: true,
      amount: true,
    },
  });
  const withdrawals = await db.desk.findMany({
    where: {
      type: "WITHDRAWAL",
    },
    select: {
      createdAt: true,
      amount: true,
    },
  });

  const todaysDeposits = deposits
    .filter((d) => isToday(d.createdAt))
    .reduce((acc, deposit) => acc + deposit.amount, 0);
  const todaysWithdrawals = withdrawals
    .filter((w) => isToday(w.createdAt))
    .reduce((acc, withdrawal) => acc + withdrawal.amount, 0);

  const total =
    deposits.reduce((acc, deposit) => acc + deposit.amount, 0) -
    withdrawals.reduce((acc, withdrawal) => acc + withdrawal.amount, 0);

  return { todaysDeposits, todaysWithdrawals, total };
};
