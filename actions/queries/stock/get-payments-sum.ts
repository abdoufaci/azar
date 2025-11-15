import { db } from "@/lib/db";
import { isToday } from "date-fns";

export const getPaymentsSum = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

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

  const todaysDeposits = await db.desk.aggregate({
    where: {
      type: "DEPOSIT",
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    _sum: {
      amount: true,
    },
  });
  const todaysWithdrawals = await db.desk.aggregate({
    where: {
      type: "WITHDRAWAL",
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const total = await db.desk.aggregate({
    _sum: {
      amount: true,
    },
  });

  return {
    todaysDeposits: todaysDeposits._sum.amount || 0,
    todaysWithdrawals: todaysWithdrawals._sum.amount || 0,
    total: total._sum.amount || 0,
  };
};
