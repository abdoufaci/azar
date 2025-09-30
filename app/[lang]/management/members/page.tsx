import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { MembersInterface } from "./_components/members-interface";
import { getEmployeesAndClients } from "@/actions/queries/users/get-employees-clients";

async function MembersPage() {
  const workshops = await getWorkshops();
  const users = await getEmployeesAndClients();

  return (
    <div className="min-h-screen p-8 ">
      <MembersInterface workshops={workshops} {...users} />
    </div>
  );
}

export default MembersPage;
