import { MembersInterface } from "./_components/members-interface";
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
  return (
    <div className="min-h-screen p-8 ">
      <MembersInterface />
    </div>
  );
}

export default MembersPage;
