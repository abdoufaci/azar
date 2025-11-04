import React from "react";
import ClientProductionsTable from "../production/_components/productions-table";
import { getEmployeesAndClients } from "@/actions/queries/users/get-employees-clients";
import { getOrderStages } from "@/actions/queries/order/get-order-stages";
import { getColumns } from "@/actions/queries/order/get-columns";

async function ClientPage() {
  const [users, orderStages, columns] = await Promise.all([
    getEmployeesAndClients(),
    getOrderStages(),
    getColumns(),
  ]);
  const { employees } = users;
  return (
    <div className="p-6">
      {/* <ClientProductionsTable
        columns={columns}
        employees={employees}
        orderStages={orderStages}
      /> */}
    </div>
  );
}

export default ClientPage;
