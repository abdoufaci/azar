import { getWorkshops } from "@/actions/queries/workshop/get-workshops";
import { MembersInterface } from "./_components/members-interface";
import { getEmployeesAndClients } from "@/actions/queries/users/get-employees-clients";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membre",
  description: "A platform for managing forniture",
  icons: {
    icon: "/icon.png",
    href: "/icon.png",
  },
};

async function MembersPage() {
  const [workshops, users] = await Promise.all([
    getWorkshops(),
    getEmployeesAndClients(),
  ]);

  return (
    <div className="min-h-screen p-8 ">
      <MembersInterface workshops={workshops} {...users} />
    </div>
  );
}

export default MembersPage;
